// pages/[username]/albums/[albumSlug].js

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../api/auth/[...nextauth]'; 
import PhotographerLayout from '../../../components/PhotographerLayout';
import PhotoSection from '../../../components/PhotoSection';
import prisma from '../../../lib/prisma';
import axios from 'axios';

import AddPhotosModal from '../../../components/AddPhotosModal';
import AssignPhotosModal from '../../../components/AssignPhotosModal';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { Bookmark, BookmarkBorder } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import PropTypes from 'prop-types';
import analyticsDb from '../../../lib/analyticsPrisma'; 
import { getOrSetAnonymousId } from '../../../lib/anonymousId';
import { toast } from 'react-hot-toast';
import { useConfirm } from '../../../context/ConfirmContext'; // Import useConfirm

export default function AlbumPage({
  album,
  photographerId,
  isOwner,
  allAlbums,
  photographerUsername,
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const { confirm } = useConfirm(); // Use the confirm function from context

  // Basic album state
  const [currentAlbum, setCurrentAlbum] = useState(album || { photographs: [] });

  // Edit mode states
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedTitle, setEditedTitle] = useState(currentAlbum.title || '');
  const [editedDescription, setEditedDescription] = useState(currentAlbum.description || '');

  // 1) Our maximum length
  const MAX_DESCRIPTION_LENGTH = 255;
  // 2) An error message if the user goes beyond the limit
  const [descriptionError, setDescriptionError] = useState('');

  // For selecting / deleting photos, etc.
  const [selectedPhotoIds, setSelectedPhotoIds] = useState([]);
  const [isAddPhotosModalOpen, setIsAddPhotosModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [availableAlbums, setAvailableAlbums] = useState([]);
  const [selectedTargetAlbum, setSelectedTargetAlbum] = useState(null);
  const [loadingAvailableAlbums, setLoadingAvailableAlbums] = useState(false);
  const [assigning, setAssigning] = useState(false);

  // On prop change, reset local album data
  useEffect(() => {
    setCurrentAlbum(album || { photographs: [] });
    setIsEditMode(false);
    setEditedTitle(album?.title || '');
    setEditedDescription(album?.description || '');
    setDescriptionError('');
  }, [album]);

  // -----------------------------------
  // Handling Title / Description
  // -----------------------------------
  const handleDescriptionChange = (value) => {
    setEditedDescription(value);

    if (value.length > MAX_DESCRIPTION_LENGTH) {
      setDescriptionError(`Description too long! Max is ${MAX_DESCRIPTION_LENGTH} characters.`);
    } else {
      setDescriptionError('');
    }
  };

  // Toggle album favourite
  const handleToggleAlbumFavourite = async () => {
    if (!session) {
      toast.error('Please log in to favourite albums!'); // Replaced alert with toast
      return;
    }

    // 1) Optimistic UI update
    setCurrentAlbum((prev) => ({
      ...prev,
      isFavourited: !prev.isFavourited,
    }));

    // 2) Decide POST or DELETE
    const method = currentAlbum.isFavourited ? 'DELETE' : 'POST';
    try {
      const res = await fetch(
        `/api/users/${photographerUsername}/albums/${currentAlbum.slug}/favourite`,
        { method }
      );
      if (!res.ok) throw new Error('Request failed');
    } catch (error) {
      console.error('Error toggling favourite:', error);
      // Roll back
      setCurrentAlbum((prev) => ({
        ...prev,
        isFavourited: !prev.isFavourited,
      }));
      toast.error('Failed to toggle favourite status.'); // Optional: Notify user of failure
    }
  };

  // Photo selection for editing
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

  // Deleting photos
  const handleDeletePhotos = async () => {
    if (selectedPhotoIds.length === 0) return;

    const confirmDelete = await confirm('Are you sure you want to delete the selected photos?');
    if (!confirmDelete) return;

    try {
      await axios.delete('/api/photographs', {
        data: { photoIds: selectedPhotoIds },
      });
      toast.success('Selected photos deleted successfully.'); // Replaced alert with toast
      setCurrentAlbum((prev) => ({
        ...prev,
        photographs: prev.photographs.filter((p) => !selectedPhotoIds.includes(p.id)),
      }));
      setSelectedPhotoIds([]);
    } catch (error) {
      console.error('Error deleting photos:', error);
      toast.error('Failed to delete photos.'); // Replaced alert with toast
    }
  };

  // Assigning photos
  const fetchAvailableAlbums = async () => {
    setLoadingAvailableAlbums(true);
    try {
      const res = await axios.get('/api/albums', {
        params: { excludeId: currentAlbum.id },
      });
      setAvailableAlbums(res.data.albums || []);
    } catch (error) {
      console.error('Error fetching available albums:', error);
      toast.error('Failed to fetch available albums.'); // Replaced alert with toast
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
      toast.error('Please select an album to assign the photos to.'); // Replaced alert with toast
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
      toast.success('Photos moved successfully.'); // Optional: Notify user of success
    } catch (error) {
      console.error('Error assigning photos:', error);
      toast.error('Failed to assign photos.'); // Replaced alert with toast
    } finally {
      setAssigning(false);
    }
  };

  // Save Album changes (title/description)
  const handleSaveAlbumChanges = async () => {
    // If there's an error or user typed too many chars, block
    if (descriptionError) {
      toast.error('Please fix the description length before saving.'); // Replaced alert with toast
      return;
    }
    try {
      const response = await axios.put(`/api/albums/${currentAlbum.slug}`, {
        title: editedTitle,
        description: editedDescription,
      });
      toast.success('Album updated successfully.'); // Replaced alert with toast
      setCurrentAlbum((prev) => ({
        ...prev,
        title: response.data.album.title,
        description: response.data.album.description,
        slug: response.data.album.slug, 
      }));
      setIsEditMode(false);
    } catch (error) {
      console.error('Error updating album:', error);
      toast.error('Failed to update album.'); // Replaced alert with toast
    }
  };

  // Delete entire album
  const handleDeleteAlbum = async () => {
    const confirmDelete = await confirm('Are you sure you want to delete this album and all its photos?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`/api/albums/${currentAlbum.slug}`);
      toast.success('Album deleted successfully.'); // Replaced alert with toast
      router.push(`/${photographerUsername}/albums`);
    } catch (error) {
      console.error('Error deleting album:', error);
      toast.error('Failed to delete album.'); // Replaced alert with toast
    }
  };

  // Photos added callback
  const handlePhotosAdded = () => {
    toast.success('Photos added successfully.'); // Optional: Notify user
    // reload to see newly added photos
    router.reload();
  };

  if (!album) {
    return <p>Error: Album not found</p>;
  }

  return (
    <div className="album-page">
      {/* Album Title & Description */}
      {!isEditMode ? (
        <>
          <h1 className="album-title">{currentAlbum.title}</h1>
          <p className="album-desc">{currentAlbum.description}</p>

          {/* Favourite (Bookmark) Icon */}
          {!isOwner && (
            <IconButton
              onClick={handleToggleAlbumFavourite}
              aria-label={
                currentAlbum.isFavourited ? 'Remove from favourites' : 'Add to favourites'
              }
              className="favourite-btn"
            >
              {currentAlbum.isFavourited ? <Bookmark /> : <BookmarkBorder />}
            </IconButton>
          )}

          {isOwner && (
            <div className="modal-actions">
              <button
                onClick={() => setIsEditMode(true)}
                className="edit-button"
                aria-label="Edit Album"
              >
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

            {/* Character Counter */}
            <div className="char-counter">
              {editedDescription.length} / {MAX_DESCRIPTION_LENGTH}
            </div>
            {/* Error message if too long */}
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
            <button
              onClick={() => setIsAddPhotosModalOpen(true)}
              className="primary-button"
            >
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

      {/* Add Photos Modal */}
      {isOwner && (
        <AddPhotosModal
          isOpen={isAddPhotosModalOpen}
          onRequestClose={() => setIsAddPhotosModalOpen(false)}
          albumId={currentAlbum.id}
          onPhotosAdded={handlePhotosAdded}
        />
      )}

      {/* Assign Photos Modal */}
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

      {/* PhotoSection for the album photos (no filter) */}
      <PhotoSection
        scope="album"
        albumSlug={currentAlbum.slug}
        initialPhotos={currentAlbum.photographs}
        enableFilters={false}
        isOwner={isOwner}
        isEditMode={isEditMode}
        onSelectPhoto={toggleSelectPhoto}
        selectedPhotoIds={selectedPhotoIds}
      />
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
// ------------------------------
// getServerSideProps
// ------------------------------


export async function getServerSideProps(context) {
  const { username, albumSlug } = context.params;
  const session = await getServerSession(context.req, context.res, authOptions);

  let userId = session?.user?.id ?? -1;;
  let anonymousId = null;
  let viewUserId = null;

  if (session?.user?.id) {
    viewUserId = session.user.id;
  } else {
    // Not logged in, so get or create an anonymousId cookie
    anonymousId = getOrSetAnonymousId(context.req, context.res);
  }

  // Fetch the photographer (with fallback for subscription, etc.)
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

  // If photographer not found, 404
  if (!user || !user.Photographer) {
    return { notFound: true };
  }

  const photographer = user.Photographer;
  const photographerId = photographer.photo_id;

  // Fetch the specific album (omitting created_at/updated_at)
  const albumData = await prisma.album.findUnique({
    where: {
      slug_photographer_id: {
        slug: albumSlug,
        photographer_id: photographerId,
      },
    },
    select: {
      // Basic fields
      id: true,
      slug: true,
      title: true,
      description: true,

      // Relationship: favourites (only need to check if user has any)
      favourites: {
        where: { user_id: userId },
        select: { id: true },
      },

      // Relationship: photographs (omitting created_at, updated_at)
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

      // Relationship: main Photographer
      Photographer: {
        select: {
          photo_id: true,
          profile_picture: true,
          // Add other fields if needed
        },
      },

      // Relationship: Category
      Category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!albumData) {
    return { notFound: true };
  }

  // Check if user has favourited the album
  const userHasAlbumFavourited = albumData.favourites.length > 0;

  // Determine ownership
  const isOwner =
    session?.user?.role === 'photographer' && session.user.username === username;

  // Build our final "album" object with booleans for isFavourited, isLiked, etc.
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

  // Fetch all albums for the sidebar (also omitting created_at/updated_at)
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

  // Log view
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