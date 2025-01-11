// pages/[username]/albums/[albumSlug].js

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../api/auth/[...nextauth]'; // Adjust path as necessary
import PhotographerLayout from '../../../components/PhotographerLayout';
import PhotoSection from '../../../components/PhotoSection'; // Reuse the same component
import prisma from '../../../lib/prisma';
import axios from 'axios';

import AddPhotosModal from '../../../components/AddPhotosModal';
import AssignPhotosModal from '../../../components/AssignPhotosModal';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { Bookmark, BookmarkBorder } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import PropTypes from 'prop-types';

export default function AlbumPage({
  album,
  photographerId,
  isOwner,
  allAlbums,
  photographerUsername,
}) {
  const router = useRouter();
  const { data: session } = useSession();

  // Initialize to prevent undefined references
  const [currentAlbum, setCurrentAlbum] = useState(album || { photographs: [] });

  // Edit mode states
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedTitle, setEditedTitle] = useState(currentAlbum.title || '');
  const [editedDescription, setEditedDescription] = useState(currentAlbum.description || '');

  const [selectedPhotoIds, setSelectedPhotoIds] = useState([]);

  // Modals
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
  }, [album]);

  // Toggle album favourite (bookmark icon)
  const handleToggleAlbumFavourite = async () => {
    if (!session) {
      alert('Please log in to favourite albums!');
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
      // Use photographerUsername (the album owner’s username) instead of session.user.username
      const res = await fetch(
        `/api/users/${photographerUsername}/albums/${currentAlbum.slug}/favourite`,
        { method }
      );
  
      if (!res.ok) {
        throw new Error('Request failed');
      }
      // If successful, do nothing extra.
    } catch (error) {
      console.error('Error toggling favourite:', error);
      // 3) Roll back the toggle if the request fails
      setCurrentAlbum((prev) => ({
        ...prev,
        isFavourited: !prev.isFavourited,
      }));
    }
  };

  // ------------------------------
  // Photo Selection
  // ------------------------------
  const toggleSelectPhoto = (photoId) => {
    setSelectedPhotoIds((prev) =>
      prev.includes(photoId) ? prev.filter((pid) => pid !== photoId) : [...prev, photoId]
    );
  };

  const handleExitEditMode = () => {
    setIsEditMode(false);
    setEditedTitle(currentAlbum.title || '');
    setEditedDescription(currentAlbum.description || '');
  };

  // ------------------------------
  // Deleting Photos
  // ------------------------------
  const handleDeletePhotos = async () => {
    if (selectedPhotoIds.length === 0) return;
    const confirmDelete = confirm(
      'Are you sure you want to permanently delete the selected photos?'
    );
    if (!confirmDelete) return;

    try {
      await axios.delete('/api/photographs', {
        data: { photoIds: selectedPhotoIds },
      });
      alert('Selected photos deleted successfully.');
      setCurrentAlbum((prev) => ({
        ...prev,
        photographs: prev.photographs.filter((p) => !selectedPhotoIds.includes(p.id)),
      }));
      setSelectedPhotoIds([]);
    } catch (error) {
      console.error('Error deleting photos:', error);
      alert('Failed to delete photos.');
    }
  };

  // ------------------------------
  // Assigning (Moving) Photos
  // ------------------------------
  const fetchAvailableAlbums = async () => {
    setLoadingAvailableAlbums(true);
    try {
      const res = await axios.get('/api/albums', {
        params: { excludeId: currentAlbum.id }, // Pass excludeId
      });
      setAvailableAlbums(res.data.albums || []);
    } catch (error) {
      console.error('Error fetching available albums:', error);
      alert('Failed to fetch available albums.');
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
      alert('Please select an album to assign the photos to.');
      return;
    }
    const targetAlbumId = selectedTargetAlbum.id;

    try {
      setAssigning(true);
      await axios.post('/api/photographs/assign', {
        photoIds: selectedPhotoIds,
        targetAlbumId,
      });
      alert('Selected photos moved successfully.');
      setCurrentAlbum((prev) => ({
        ...prev,
        photographs: prev.photographs.filter((p) => !selectedPhotoIds.includes(p.id)),
      }));
      setSelectedPhotoIds([]);
      setIsAssignModalOpen(false);
      setSelectedTargetAlbum(null);
    } catch (error) {
      console.error('Error assigning photos:', error);
      alert('Failed to assign photos.');
    } finally {
      setAssigning(false);
    }
  };

  // ------------------------------
  // Album Edit & Delete
  // ------------------------------
  const handleSaveAlbumChanges = async () => {
    try {
      const response = await axios.put(`/api/albums/${currentAlbum.slug}`, {
        title: editedTitle,
        description: editedDescription,
      });
      alert('Album updated successfully.');
      setCurrentAlbum((prev) => ({
        ...prev,
        title: response.data.album.title,
        description: response.data.album.description,
        slug: response.data.album.slug, // Update slug if title changed
      }));
      setIsEditMode(false);
    } catch (error) {
      console.error('Error updating album:', error);
      alert('Failed to update album.');
    }
  };

  const handleDeleteAlbum = async () => {
    const confirmDelete = confirm(
      'Are you sure you want to delete this album and all its photos?'
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`/api/albums/${currentAlbum.slug}`);
      alert('Album deleted successfully.');
      router.push(`/${photographerUsername}/albums`);
    } catch (error) {
      console.error('Error deleting album:', error);
      alert('Failed to delete album.');
    }
  };

  // ------------------------------
  // Handle photos added
  // ------------------------------
  const handlePhotosAdded = () => {
    // Simple approach; reload to see newly added photos
    router.reload();
  };

  // ------------------------------
  // Early Return if Not Found
  // ------------------------------
  if (!album) {
    return <p>Error: Album not found</p>;
  }

  // ------------------------------
  // Rendering
  // ------------------------------
  return (
    <div className="album-page">
      {/* Album Title & Description */}
      {!isEditMode ? (
        <>
          <h1 className="album-title">{currentAlbum.title}</h1>
          <p className="album-desc">{currentAlbum.description}</p>

          {/* Favourite (Bookmark) Icon */}
          <IconButton
            onClick={handleToggleAlbumFavourite}
            aria-label={
              currentAlbum.isFavourited ? 'Remove from favourites' : 'Add to favourites'
            }
            className="favourite-btn"
          >
            {currentAlbum.isFavourited ? <Bookmark /> : <BookmarkBorder />}
          </IconButton>

          {/* Edit button for owner */}
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
          <textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            className="album-desc-edit"
            aria-label="Edit Album Description"
          />
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

// Wrap page with PhotographerLayout
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
  const userId = session?.user?.id ?? -1;

  // Fetch the photographer (with fallback for subscription, etc.)
  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      Photographer: {
        include: {
          Subscription: true,
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