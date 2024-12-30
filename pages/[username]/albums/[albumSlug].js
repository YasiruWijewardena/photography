// pages/[username]/albums/[albumSlug].js

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../api/auth/[...nextauth]'; // Adjust path as necessary
import PhotographerLayout from '../../../components/PhotographerLayout';
import PhotoSection from '../../../components/PhotoSection'; // Reuse the same component
import prisma from '../../../lib/prisma';
import axios from 'axios'; // Import axios

import AddPhotosModal from '../../../components/AddPhotosModal';
import AssignPhotosModal from '../../../components/AssignPhotosModal';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import PropTypes from 'prop-types';
import path from 'path';

export default function AlbumPage({ album, photographerId, isOwner, allAlbums, photographerUsername }) {
  const router = useRouter();
  const { data: session } = useSession();

  // Safely initialize to prevent "undefined is not an object"
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

  // Effect to update album data when props change
  useEffect(() => {
    setCurrentAlbum(album || { photographs: [] });

    // Reset edit-related states
    setIsEditMode(false);
    setEditedTitle(album?.title || '');
    setEditedDescription(album?.description || '');
  }, [album]);

  // ------------------------------
  // Photo Selection
  // ------------------------------
  const toggleSelectPhoto = (photoId) => {
    setSelectedPhotoIds((prev) =>
      prev.includes(photoId)
        ? prev.filter((pid) => pid !== photoId)
        : [...prev, photoId]
    );
  };

  const handleExitEditMode = () => {
    setIsEditMode(false);
    // Reset to the latest data in currentAlbum
    setEditedTitle(currentAlbum.title || '');
    setEditedDescription(currentAlbum.description || '');
  };

  // ------------------------------
  // Deleting Photos (Reflect in UI)
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

      // Remove the deleted photos from currentAlbum.photographs array
      setCurrentAlbum((prev) => ({
        ...prev,
        photographs: prev.photographs.filter(
          (p) => !selectedPhotoIds.includes(p.id)
        ),
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
        params: { excludeId: currentAlbum.id }, // Pass excludeId instead of excludeSlug
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

    const targetAlbumId = selectedTargetAlbum.id; // Use album.id instead of slug
    try {
      setAssigning(true);
      await axios.post('/api/photographs/assign', {
        photoIds: selectedPhotoIds,
        targetAlbumId, // Send album.id
      });
      alert('Selected photos moved successfully.');

      // Remove the moved photos from currentAlbum
      setCurrentAlbum((prev) => ({
        ...prev,
        photographs: prev.photographs.filter(
          (p) => !selectedPhotoIds.includes(p.id)
        ),
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

      // Update local state with the new album data
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

  // Handle photos added
  const handlePhotosAdded = () => {
    // Optionally, reset or refresh photos in PhotoSection
    // For simplicity, reload the page or trigger a re-fetch
    router.reload(); // Simple approach; consider a more efficient update
  };

  // ------------------------------
  // Early Returns / Rendering
  // ------------------------------
  if (!album) {
    return <p>Error: Album not found</p>; // Graceful error handling
  }

  return (
    <div className="album-page">
      {/* Album Title & Description */}
      {!isEditMode ? (
        <>
          <h1 className="album-title">{currentAlbum.title}</h1>
          <p className="album-desc">{currentAlbum.description}</p>
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

      {/* Reuse PhotoSection for the album's photos (no filter) */}
      <PhotoSection
        scope="album"
        albumSlug={currentAlbum.slug} // Pass slug instead of id
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
      photographerUsername={photographerUsername} // Pass photographerUsername
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

  // Fetch the photographer based on username
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

  if (!user || !user.Photographer) {
    return { notFound: true };
  }

  const photographer = user.Photographer;
  const photographerId = photographer.photo_id; // Correctly assign photographerId

  // Fetch the album based on the compound unique key (slug + photographer_id)
  const albumData = await prisma.album.findUnique({
    where: {
      slug_photographer_id: {
        slug: albumSlug,
        photographer_id: photographerId, // Correctly pass the photographer's ID
      },
    },
    include: {
      photographs: {
        include: {
          likes: { where: { user_id: session?.user?.id ?? -1 } },
          favourites: { where: { user_id: session?.user?.id ?? -1 } },
          Photographer: {
            include: {
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
      Photographer: true,
      Category: true,
    },
  });

  if (!albumData) {
    return { notFound: true };
  }

  // Determine ownership
  const isOwner =
    session?.user?.role === 'photographer' &&
    session.user.username === username; // Compare usernames

  // Serialize album data
  const serializedAlbum = {
    ...albumData,
    id: albumData.id,
    created_at: albumData.created_at.toISOString(),
    updated_at: albumData.updated_at.toISOString(),
    photographs: albumData.photographs.map((p) => ({
      ...p,
      created_at: p.created_at.toISOString(),
      updated_at: p.updated_at.toISOString(),
      isLiked: session?.user ? p.likes.length > 0 : false,
      isFavourited: session?.user ? p.favourites.length > 0 : false,
      photographer: {
        id: p.Photographer.photo_id, // Correctly reference photo_id
        name: `${p.Photographer.User.firstname} ${p.Photographer.User.lastname}`,
        profile_picture: p.Photographer.profile_picture,
      },
      likes: p.likes.map((like) => ({
        ...like,
        created_at: like.created_at.toISOString(),
        updated_at: like.updated_at.toISOString(),
      })),
      favourites: p.favourites.map((fav) => ({
        ...fav,
        created_at: fav.created_at.toISOString(),
        updated_at: fav.updated_at.toISOString(),
      })),
    })),
  };

  // Fetch all albums for sidebar
  const allAlbumsData = await prisma.album.findMany({
    where: { photographer_id: photographerId },
    include: {
      photographs: { take: 1, select: { thumbnail_url: true } },
    },
    orderBy: { created_at: 'asc' },
  });
  const serializedAllAlbums = allAlbumsData.map((a) => ({
    ...a,
    created_at: a.created_at.toISOString(),
    updated_at: a.updated_at.toISOString(),
  }));

  return {
    props: {
      album: serializedAlbum,
      allAlbums: serializedAllAlbums,
      photographerId: photographerId, // Now correctly defined
      isOwner,
      photographerUsername: username,
    },
  };
}