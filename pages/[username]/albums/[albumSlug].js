// pages/[username]/albums/[albumSlug].js
import '../../../styles/public/albums.css';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../api/auth/[...nextauth]';
import PhotographerLayout from '../../../components/PhotographerLayout';
import Timeline from '../../../components/Timeline';
import prisma from '../../../lib/prisma';
import axios from 'axios';
import AddPhotosModal from '../../../components/AddPhotosModal';
import AssignPhotosModal from '../../../components/AssignPhotosModal';
import PhotoSection from '../../../components/PhotoSection';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { Bookmark, BookmarkBorder } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import PropTypes from 'prop-types';
import analyticsDb from '../../../lib/analyticsPrisma';
import { getOrSetAnonymousId } from '../../../lib/anonymousId';
import { toast } from 'react-hot-toast';
import { useConfirm } from '../../../context/ConfirmContext';


export default function AlbumPage({
  album,
  photographerId,
  isOwner,
  allAlbums,
  photographerUsername,
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const { confirm } = useConfirm();

  // Basic album state
  const [currentAlbum, setCurrentAlbum] = useState(album || { photographs: [] });
  // Edit mode states
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedTitle, setEditedTitle] = useState(currentAlbum.title || '');
  const [editedDescription, setEditedDescription] = useState(currentAlbum.description || '');
  const MAX_DESCRIPTION_LENGTH = 255;
  const [descriptionError, setDescriptionError] = useState('');
  const [selectedPhotoIds, setSelectedPhotoIds] = useState([]);
  const [isAddPhotosModalOpen, setIsAddPhotosModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [availableAlbums, setAvailableAlbums] = useState([]);
  const [selectedTargetAlbum, setSelectedTargetAlbum] = useState(null);
  const [loadingAvailableAlbums, setLoadingAvailableAlbums] = useState(false);
  const [assigning, setAssigning] = useState(false);

  // Extract chapters (fetched in getServerSideProps)
  const chapters = currentAlbum.chapters || [];

  // Refs for chapter sections and album content container.
  const chapterRefs = useRef({});
  const albumContentRef = useRef(null);

  // IntersectionObserver state for active chapter and overall scroll progress.
  const [activeChapterId, setActiveChapterId] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // State for computed chapter positions (each with chapterId, title, offsetPercent)
  const [chapterPositions, setChapterPositions] = useState([]);

  // Group photographs by chapter
  const photosByChapter = chapters.map((chapter) => ({
    chapter,
    photos: currentAlbum.photographs.filter((photo) => photo.chapterId === chapter.id),
  }));
  const unassignedPhotos = currentAlbum.photographs.filter((photo) => !photo.chapterId);

  useEffect(() => {
    setCurrentAlbum(album || { photographs: [] });
    setIsEditMode(false);
    setEditedTitle(album?.title || '');
    setEditedDescription(album?.description || '');
    setDescriptionError('');
  }, [album]);

  useEffect(() => {
    // Set up IntersectionObserver for chapter sections to update activeChapterId.
    const observerOptions = {
      root: albumContentRef.current,
      rootMargin: '0px',
      threshold: 0.5,
    };
    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveChapterId(entry.target.id); // e.g., "chapter-<id>"
        }
      });
    };
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    Object.values(chapterRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });
    return () => observer.disconnect();
  }, [chapters]);

  useEffect(() => {
    // Compute chapter positions relative to the album content container.
    if (albumContentRef.current && chapters.length > 0) {
      const container = albumContentRef.current;
      const totalScrollable = container.scrollHeight - container.clientHeight;
      const effectiveScrollable = totalScrollable > 0 ? totalScrollable : container.scrollHeight;
      const positions = chapters.map((chapter) => {
        const el = chapterRefs.current[`chapter-${chapter.id}`];
        if (el) {
          const offsetTop = el.offsetTop;
          const offsetPercent = (offsetTop / effectiveScrollable) * 100;
          return { chapterId: chapter.id, title: chapter.title, offsetPercent };
        } else {
          return { chapterId: chapter.id, title: chapter.title, offsetPercent: 0 };
        }
      });
      console.log("Computed chapterPositions:", positions);
      setChapterPositions(positions);
    }
  }, [chapters, currentAlbum]);

  // Compute scroll progress as a percentage.
  // Remove the onScroll from the container and add a window scroll listener:
  useEffect(() => {
    const handleWindowScroll = () => {
      // Use document.documentElement for cross-browser support.
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleWindowScroll);
    return () => window.removeEventListener('scroll', handleWindowScroll);
  }, []);

  const handleDescriptionChange = (value) => {
    setEditedDescription(value);
    if (value.length > MAX_DESCRIPTION_LENGTH) {
      setDescriptionError(`Description too long! Max is ${MAX_DESCRIPTION_LENGTH} characters.`);
    } else {
      setDescriptionError('');
    }
  };

  const handleToggleAlbumFavourite = async () => {
    if (!session) {
      toast.error('Please log in to favourite albums!');
      return;
    }
    setCurrentAlbum((prev) => ({
      ...prev,
      isFavourited: !prev.isFavourited,
    }));
    const method = currentAlbum.isFavourited ? 'DELETE' : 'POST';
    try {
      const res = await fetch(
        `/api/users/${photographerUsername}/albums/${currentAlbum.slug}/favourite`,
        { method }
      );
      if (!res.ok) throw new Error('Request failed');
    } catch (error) {
      console.error('Error toggling favourite:', error);
      setCurrentAlbum((prev) => ({
        ...prev,
        isFavourited: !prev.isFavourited,
      }));
      toast.error('Failed to toggle favourite status.');
    }
  };

  const toggleSelectPhoto = (photoId) => {
    setSelectedPhotoIds((prev) =>
      prev.includes(photoId) ? prev.filter((pid) => pid !== photoId) : [...prev, photoId]
    );
  };

  const handleExitEditMode = () => {
    setIsEditMode(false);
    setEditedTitle(currentAlbum.title || '');
    setEditedDescription(currentAlbum.description || '');
    setDescriptionError('');
  };

  const handleDeletePhotos = async () => {
    if (selectedPhotoIds.length === 0) return;
    const confirmDelete = await confirm('Are you sure you want to delete the selected photos?');
    if (!confirmDelete) return;
    try {
      await axios.delete('/api/photographs', {
        data: { photoIds: selectedPhotoIds },
      });
      toast.success('Selected photos deleted successfully.');
      setCurrentAlbum((prev) => ({
        ...prev,
        photographs: prev.photographs.filter((p) => !selectedPhotoIds.includes(p.id)),
      }));
      setSelectedPhotoIds([]);
    } catch (error) {
      console.error('Error deleting photos:', error);
      toast.error('Failed to delete photos.');
    }
  };

  const fetchAvailableAlbums = async () => {
    setLoadingAvailableAlbums(true);
    try {
      const res = await axios.get('/api/albums', {
        params: { excludeId: currentAlbum.id },
      });
      setAvailableAlbums(res.data.albums || []);
    } catch (error) {
      console.error('Error fetching available albums:', error);
      toast.error('Failed to fetch available albums.');
    } finally {
      setLoadingAvailableAlbums(false);
    }
  };

  const handleAssignPhotos = async () => {
    if (selectedPhotoIds.length === 0) return;
    setIsAssignModalOpen(true);
    await fetchAvailableAlbums();
  };

  const handleConfirmAssignment = async () => {
    if (!selectedTargetAlbum) {
      toast.error('Please select an album to assign the photos to.');
      return;
    }
    const targetAlbumId = selectedTargetAlbum.id;
    try {
      setAssigning(true);
      await axios.post('/api/photographs/assign', {
        photoIds: selectedPhotoIds,
        targetAlbumId,
      });
      setCurrentAlbum((prev) => ({
        ...prev,
        photographs: prev.photographs.filter((p) => !selectedPhotoIds.includes(p.id)),
      }));
      setSelectedPhotoIds([]);
      setIsAssignModalOpen(false);
      setSelectedTargetAlbum(null);
      toast.success('Photos moved successfully.');
    } catch (error) {
      console.error('Error assigning photos:', error);
      toast.error('Failed to assign photos.');
    } finally {
      setAssigning(false);
    }
  };

  const handleSaveAlbumChanges = async () => {
    if (descriptionError) {
      toast.error('Please fix the description length before saving.');
      return;
    }
    try {
      const response = await axios.put(`/api/albums/${currentAlbum.slug}`, {
        title: editedTitle,
        description: editedDescription,
      });
      toast.success('Album updated successfully.');
      setCurrentAlbum((prev) => ({
        ...prev,
        title: response.data.album.title,
        description: response.data.album.description,
        slug: response.data.album.slug,
      }));
      setIsEditMode(false);
    } catch (error) {
      console.error('Error updating album:', error);
      toast.error('Failed to update album.');
    }
  };

  const handleDeleteAlbum = async () => {
    const confirmDelete = await confirm('Are you sure you want to delete this album and all its photos?');
    if (!confirmDelete) return;
    try {
      await axios.delete(`/api/albums/${currentAlbum.slug}`);
      toast.success('Album deleted successfully.');
      router.push(`/${photographerUsername}/albums`);
    } catch (error) {
      console.error('Error deleting album:', error);
      toast.error('Failed to delete album.');
    }
  };

  const handlePhotosAdded = () => {
    toast.success('Photos added successfully.');
    router.reload();
  };

  // Handler for timeline clicks – scroll to the corresponding chapter section.
  const handleTimelineClick = (chapterId) => {
    if (chapterId === 'end') {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth',
      });
    } else {
      const el = chapterRefs.current[`chapter-${chapterId}`];
      if (el) {
        // Get the element's position relative to the document
        const elementTop = el.getBoundingClientRect().top + window.pageYOffset;
        // Calculate an offset (25% of the viewport height)
        const offset = window.innerHeight * 0.25;
        // Scroll so that the element's top is offset by 25% of the viewport height
        window.scrollTo({
          top: elementTop - offset,
          behavior: 'smooth',
        });
      }
    }
  };

  if (!album) {
    return <p>Error: Album not found</p>;
  }

  return (
    <div className="album-page" style={{ display: 'flex' }}>
      {/* Timeline Sidebar with computed chapterPositions and scroll progress */}
      <Timeline
        chapterPositions={chapterPositions}
        progress={scrollProgress}
        onChapterClick={handleTimelineClick}
      />

      <div
        className="album-content"
        style={{ flex: 1, padding: '0 20px 0 150px' }}
        ref={albumContentRef}
      >
        {/* Album Title & Description */}
        {!isEditMode ? (
          <>
            <h1 className="album-title">{currentAlbum.title}</h1>
            <p className="album-desc">{currentAlbum.description}</p>
            {!isOwner && (
              <IconButton
                onClick={handleToggleAlbumFavourite}
                aria-label={currentAlbum.isFavourited ? 'Remove from favourites' : 'Add to favourites'}
                className="favourite-btn"
              >
                {currentAlbum.isFavourited ? <Bookmark /> : <BookmarkBorder />}
              </IconButton>
            )}
            {isOwner && (
              <div className="modal-actions">
                <button onClick={() => setIsEditMode(true)} className="edit-button" aria-label="Edit Album">
                  <EditRoundedIcon />
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            <h1>
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="album-title-edit"
                aria-label="Edit Album Title"
              />
            </h1>
            <div className="edit-description-wrapper">
              <textarea
                value={editedDescription}
                onChange={(e) => handleDescriptionChange(e.target.value)}
                className="album-desc-edit"
                aria-label="Edit Album Description"
              />
              <div className="char-counter">
                {editedDescription.length} / {MAX_DESCRIPTION_LENGTH}
              </div>
              {descriptionError && (
                <p className="error-message" style={{ color: 'red' }}>
                  {descriptionError}
                </p>
              )}
            </div>
            <div className="modal-actions">
              <button onClick={handleSaveAlbumChanges} className="primary-button">
                Save Changes
              </button>
              <button onClick={() => setIsAddPhotosModalOpen(true)} className="primary-button">
                Add Photos
              </button>
              <button
                onClick={handleDeletePhotos}
                disabled={selectedPhotoIds.length === 0}
                className="bulk-delete-button"
              >
                Delete Selected Photos
              </button>
              <button
                onClick={handleAssignPhotos}
                disabled={selectedPhotoIds.length === 0}
                className="bulk-assign-button"
              >
                Move Selected Photos
              </button>
              <button onClick={handleDeleteAlbum} className="delete-album-button">
                Delete Album
              </button>
              <button onClick={handleExitEditMode} className="cancel-edit-button">
                Exit Edit Mode
              </button>
            </div>
          </>
        )}

        {/* Modals for adding/assigning photos */}
        {isOwner && (
          <AddPhotosModal
            isOpen={isAddPhotosModalOpen}
            onRequestClose={() => setIsAddPhotosModalOpen(false)}
            albumId={currentAlbum.id}
            onPhotosAdded={handlePhotosAdded}
          />
        )}
        {isOwner && (
          <AssignPhotosModal
            isOpen={isAssignModalOpen}
            onRequestClose={() => setIsAssignModalOpen(false)}
            availableAlbums={availableAlbums}
            selectedTargetAlbum={selectedTargetAlbum}
            setSelectedTargetAlbum={setSelectedTargetAlbum}
            loadingAvailableAlbums={loadingAvailableAlbums}
            handleConfirmAssignment={handleConfirmAssignment}
            assigning={assigning}
          />
        )}

        {/* Render album chapters with associated photos */}
        {chapters.map((chapter) => {
          // Filter photos for the current chapter.
          const photosForChapter = currentAlbum.photographs.filter(
            (photo) => photo.chapterId === chapter.id
          );

          return (
            <section
              key={chapter.id}
              id={`chapter-${chapter.id}`}
              style={{ marginBottom: '50px' }}
              ref={(el) => (chapterRefs.current[`chapter-${chapter.id}`] = el)}
            >
              <h2>{chapter.title}</h2>
              {photosForChapter.length > 0 ? (
                <PhotoSection
                  scope="album"
                  albumSlug={currentAlbum.slug}
                  // Pass the filtered photos to PhotoSection
                  initialPhotos={photosForChapter}
                  enableFilters={false}  // Disable filters if not needed for chapter views
                  isOwner={isOwner}
                />
              ) : (
                <p>No photos in this chapter.</p>
              )}
            </section>
          );
        })}

        {/* Optionally, render unassigned photos */}
        {unassignedPhotos.length > 0 && (
          <section id="chapter-unassigned" style={{ marginBottom: '50px' }}>
            <h2>Other Photos</h2>
            <div className="photo-grid">
              {unassignedPhotos.map((photo) => (
                <div key={photo.id} className="photo-card">
                  <img src={photo.image_url} alt={photo.title} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

AlbumPage.propTypes = {
  album: PropTypes.object.isRequired,
  photographerId: PropTypes.number.isRequired,
  isOwner: PropTypes.bool.isRequired,
  allAlbums: PropTypes.array.isRequired,
  photographerUsername: PropTypes.string.isRequired,
};

AlbumPage.getLayout = function getLayout(page) {
  const { album, allAlbums, photographerId, isOwner, photographerUsername } = page.props;
  return (
    <PhotographerLayout
      isOwner={isOwner}
      photographerId={photographerId}
      photographerUsername={photographerUsername}
      useAlbumSidebar
      albums={allAlbums || []}
    >
      {page}
    </PhotographerLayout>
  );
};

export async function getServerSideProps(context) {
  const { username, albumSlug } = context.params;
  const session = await getServerSession(context.req, context.res, authOptions);
  let userId = session?.user?.id ?? -1;
  let anonymousId = null;
  let viewUserId = null;

  if (session?.user?.id) {
    viewUserId = session.user.id;
  } else {
    anonymousId = getOrSetAnonymousId(context.req, context.res);
  }

  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      Photographer: {
        include: {
          subscriptions: {
            where: { active: true },
            include: { subscriptionPlan: { select: { id: true, name: true } } },
            take: 1,
          },
          albums: {
            include: {
              photographs: { take: 1, select: { thumbnail_url: true } },
            },
          },
        },
      },
    },
  });

  if (!user || !user.Photographer) {
    return { notFound: true };
  }

  const photographer = user.Photographer;
  const photographerId = photographer.photo_id;

  const albumData = await prisma.album.findUnique({
    where: {
      slug_photographer_id: {
        slug: albumSlug,
        photographer_id: photographerId,
      },
    },
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
      favourites: {
        where: { user_id: userId },
        select: { id: true },
      },
      photographs: {
        select: {
          id: true,
          album_id: true,
          title: true,
          description: true,
          image_url: true,
          thumbnail_url: true,
          cameraModel: true,
          lens: true,
          exposure: true,
          focalLength: true,
          likes_count: true,
          chapterId: true,
          likes: {
            where: { user_id: userId },
            select: { id: true },
          },
          favourites: {
            where: { user_id: userId },
            select: { id: true },
          },
          Photographer: {
            select: {
              photo_id: true,
              profile_picture: true,
              User: {
                select: {
                  firstname: true,
                  lastname: true,
                  email: true,
                },
              },
            },
          },
        },
      },
      Photographer: {
        select: {
          photo_id: true,
          profile_picture: true,
        },
      },
      Category: {
        select: {
          id: true,
          name: true,
        },
      },
      // Fetch chapters ordered by their "order" field
      chapters: {
        orderBy: { order: 'asc' },
        select: { id: true, title: true, order: true },
      },
    },
  });

  if (!albumData) {
    return { notFound: true };
  }

  const userHasAlbumFavourited = albumData.favourites.length > 0;
  const isOwner = session?.user?.role === 'photographer' && session.user.username === username;

  const album = {
    ...albumData,
    isFavourited: userHasAlbumFavourited,
    photographs: albumData.photographs.map((photo) => ({
      ...photo,
      isLiked: photo.likes.length > 0,
      isFavourited: photo.favourites.length > 0,
      photographer: {
        id: photo.Photographer.photo_id,
        name: `${photo.Photographer.User.firstname} ${photo.Photographer.User.lastname}`,
        profile_picture: photo.Photographer.profile_picture,
      },
    })),
  };

  const allAlbumsData = await prisma.album.findMany({
    where: { photographer_id: photographerId },
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
      photographs: {
        take: 1,
        select: { thumbnail_url: true },
      },
    },
    orderBy: { created_at: 'asc' },
  });

  if (!isOwner) {
    await analyticsDb.albumViewEvent.create({
      data: {
        userId: viewUserId,
        anonymousId: anonymousId,
        albumId: albumData.id,
      },
    });
  }

  return {
    props: {
      album,
      allAlbums: allAlbumsData,
      photographerId,
      isOwner,
      photographerUsername: username,
    },
  };
}