// // pages/photographer/[id]/albums/[albumId].js

// import { useState, useEffect, useRef } from 'react';
// import { useRouter } from 'next/router';
// import { useSession } from 'next-auth/react';
// import axios from '../../../../lib/axios';
// import Image from 'next/image';
// import Masonry from 'react-masonry-css';
// import Modal from 'react-modal';
// import PhotographerLayout from '../../../../components/PhotographerLayout';
// import AddPhotosModal from '../../../../components/AddPhotosModal';
// import AssignPhotosModal from '../../../../components/AssignPhotosModal';
// import CreateAlbumModal from '../../../../components/CreateAlbumModal';
// import ImageGallery from 'react-image-gallery';
// import 'react-image-gallery/styles/css/image-gallery.css';
// import { motion, AnimatePresence } from 'framer-motion';
// import EditRoundedIcon from '@mui/icons-material/EditRounded';
// import OpenInFullRoundedIcon from '@mui/icons-material/OpenInFullRounded';
// import CloseFullscreenRoundedIcon from '@mui/icons-material/CloseFullscreenRounded';
// import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

// // Only needed on the client side
// if (typeof window !== 'undefined') {
//   Modal.setAppElement('#__next');
// }

// // Parent container variants
// const containerVariants = {
//   hidden: { opacity: 0 },
//   visible: {
//     opacity: 1,
//     transition: {
//       staggerChildren: 0.1,
//     },
//   },
// };

// // Child item variants
// const itemVariants = {
//   hidden: { y: 20, opacity: 0 },
//   visible: {
//     y: 0,
//     opacity: 1,
//     transition: { duration: 0.6, ease: [0.25, 0.8, 0.25, 1] },
//   },
// };

// export default function AlbumPage({ triggerSidebarRefresh }) {
//   // We accept triggerSidebarRefresh from Layout
//   const router = useRouter();
//   const { id } = router.query;
//   const { data: session, status } = useSession();

//   const [album, setAlbum] = useState(null);
//   const [loadingAlbum, setLoadingAlbum] = useState(false);

//   const [isEditMode, setIsEditMode] = useState(false);
//   const [editedTitle, setEditedTitle] = useState('');
//   const [editedDescription, setEditedDescription] = useState('');

//   const [selectedPhotoIds, setSelectedPhotoIds] = useState([]);
//   const [isAddPhotosModalOpen, setIsAddPhotosModalOpen] = useState(false);

//   const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
//   const [availableAlbums, setAvailableAlbums] = useState([]);
//   const [selectedTargetAlbum, setSelectedTargetAlbum] = useState(null);
//   const [loadingAvailableAlbums, setLoadingAvailableAlbums] = useState(false);
//   const [assigning, setAssigning] = useState(false);

//   const [isCreateAlbumModalOpen, setIsCreateAlbumModalOpen] = useState(false);

//   const [isCarouselOpen, setIsCarouselOpen] = useState(false);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [isFullscreen, setIsFullscreen] = useState(false);

//   // State for control visibility
//   const [showControls, setShowControls] = useState(true);
//   const controlTimeoutRef = useRef(null);

//   useEffect(() => {
//     if (status === 'authenticated' && id) {
//       fetchAlbum();
//     }
//     if (status === 'loading') setLoadingAlbum(true);
//     if (status === 'unauthenticated') {
//       alert('You must be logged in as a photographer to view this page.');
//       router.push('/login');
//     }
//   }, [status, id]);

//   useEffect(() => {
//     const handleFullscreenChange = () => {
//       if (!document.fullscreenElement) {
//         setIsFullscreen(false);
//       }
//     };

//     document.addEventListener('fullscreenchange', handleFullscreenChange);
//     return () => {
//       document.removeEventListener('fullscreenchange', handleFullscreenChange);
//     };
//   }, []);

//   useEffect(() => {
//     const handleMouseMove = () => {
//       setShowControls(true);
//       if (controlTimeoutRef.current) {
//         clearTimeout(controlTimeoutRef.current);
//       }
//       controlTimeoutRef.current = setTimeout(() => {
//         setShowControls(false);
//       }, 3000); // Hide after 3 seconds of inactivity
//     };

//     if (isCarouselOpen) {
//       document.addEventListener('mousemove', handleMouseMove);
//       // Initialize the timeout
//       handleMouseMove();
//     } else {
//       document.removeEventListener('mousemove', handleMouseMove);
//       setShowControls(true);
//     }

//     return () => {
//       document.removeEventListener('mousemove', handleMouseMove);
//       if (controlTimeoutRef.current) {
//         clearTimeout(controlTimeoutRef.current);
//       }
//     };
//   }, [isCarouselOpen]);

//   const fetchAlbum = async () => {
//     setLoadingAlbum(true);
//     try {
//       const albumRes = await axios.get(`/api/albums/${id}`);
//       setAlbum(albumRes.data.album);
//       setEditedTitle(albumRes.data.album.title);
//       setEditedDescription(albumRes.data.album.description);
//     } catch (error) {
//       console.error('Error fetching album:', error);
//       alert('Failed to fetch album.');
//     } finally {
//       setLoadingAlbum(false);
//     }
//   };

//   const toggleSelectPhoto = (photoId) => {
//     setSelectedPhotoIds((prev) =>
//       prev.includes(photoId) ? prev.filter((pid) => pid !== photoId) : [...prev, photoId]
//     );
//   };

//   const handleDeletePhotos = async () => {
//     if (selectedPhotoIds.length === 0) return;
//     const confirmDelete = confirm('Are you sure you want to permanently delete the selected photos?');
//     if (!confirmDelete) return;

//     try {
//       await axios.delete('/api/photographs', {
//         data: { photoIds: selectedPhotoIds },
//       });
//       alert('Selected photos deleted successfully.');
//       setSelectedPhotoIds([]);
//       fetchAlbum();
//     } catch (error) {
//       console.error('Error deleting photos:', error);
//       alert('Failed to delete photos.');
//     }
//   };

//   const fetchAvailableAlbums = async () => {
//     setLoadingAvailableAlbums(true);
//     try {
//       const res = await axios.get('/api/albums', { params: { excludeId: id } });
//       setAvailableAlbums(res.data.albums || []);
//     } catch (error) {
//       console.error('Error fetching available albums:', error);
//       alert('Failed to fetch available albums.');
//     } finally {
//       setLoadingAvailableAlbums(false);
//     }
//   };

//   const handleAssignPhotos = async () => {
//     if (selectedPhotoIds.length === 0) return;
//     setIsAssignModalOpen(true);
//     await fetchAvailableAlbums();
//   };

//   const handleConfirmAssignment = async () => {
//     if (!selectedTargetAlbum) {
//       alert('Please select an album to assign the photos to.');
//       return;
//     }

//     const targetAlbumId = Number(selectedTargetAlbum.value);
//     try {
//       setAssigning(true);
//       await axios.post('/api/photographs/assign', {
//         photoIds: selectedPhotoIds,
//         targetAlbumId: targetAlbumId,
//       });
//       alert('Selected photos moved successfully.');
//       setSelectedPhotoIds([]);
//       setIsAssignModalOpen(false);
//       setSelectedTargetAlbum(null);
//       fetchAlbum();
//     } catch (error) {
//       console.error('Error assigning photos:', error);
//       alert('Failed to assign photos.');
//     } finally {
//       setAssigning(false);
//     }
//   };

//   const handleSaveAlbumChanges = async () => {
//     try {
//       await axios.put(`/api/albums/${id}`, {
//         title: editedTitle,
//         description: editedDescription,
//       });
//       alert('Album updated successfully.');
//       fetchAlbum();
//     } catch (error) {
//       console.error('Error updating album:', error);
//       alert('Failed to update album.');
//     }
//   };

//   const handleDeleteAlbum = async () => {
//     const confirmDelete = confirm('Are you sure you want to delete this album and all its photos?');
//     if (!confirmDelete) return;

//     try {
//       await axios.delete(`/api/albums/${id}`);
//       alert('Album deleted successfully.');
//       // Now call the function from Layout:
//       triggerSidebarRefresh();
//       // Optionally, route back:
//       router.push('/photographer/album');
//     } catch (error) {
//       console.error('Error deleting album:', error);
//       alert('Failed to delete album.');
//     }
//   };

//   const openCarousel = (index) => {
//     setCurrentIndex(index);
//     setIsCarouselOpen(true);
//   };

//   const closeCarousel = () => {
//     setIsCarouselOpen(false);
//     setIsFullscreen(false);
//   };

//   if (loadingAlbum) return <p>Loading album...</p>;
//   if (!album) return <p>Album not found.</p>;

//   // Prepare images for the carousel
//   const carouselImages = album.photographs.map((photo) => ({
//     original: photo.image_url,
//     thumbnail: photo.thumbnail_url,
//     description: photo.description,
//     title: photo.title,
//     metadata: {
//       width: photo.image_width,
//       height: photo.image_height,
//       cameraModel: photo.cameraModel,
//       lens: photo.lens,
//       exposure: photo.exposure,
//       focalLength: photo.focalLength,
//     },
//   }));

//   // Masonry breakpoint columns
//   const breakpointColumnsObj = {
//     default: 4,
//     1100: 3,
//     700: 2,
//     500: 1,
//   };

//   // Modal fade/slide variants
//   const modalVariants = {
//     hidden: { opacity: 0, y: -50 },
//     visible: { opacity: 1, y: 0 },
//     exit: { opacity: 0, y: -50 },
//   };

//   return (
//     <div className="album-page">
//       {!isEditMode ? (
//         <>
//           <h1 className='album-title'>{album.title}</h1>
//           <p className='album-desc'>{album.description}</p>
//           <div className="modal-actions"> 
//             <button onClick={() => setIsEditMode(true)} className="edit-button">
//               <EditRoundedIcon/>
//             </button>
//           </div>
//         </>
//       ) : (
//         <>
//           <h1>
//             <input
//               type="text"
//               value={editedTitle}
//               onChange={(e) => setEditedTitle(e.target.value)}
//               className='album-title-edit'
//             />
//           </h1>
//           <textarea
//             value={editedDescription}
//             onChange={(e) => setEditedDescription(e.target.value)}
//             className='album-desc-edit'
//           ></textarea>
//           <div className="modal-actions">
//             <button onClick={handleSaveAlbumChanges} className="primary-button">
//               Save Album Changes
//             </button>
//             <button 
//               onClick={() => setIsAddPhotosModalOpen(true)} 
//               className="primary-button" 
//               style={{ marginLeft: '10px' }}
//             >
//               Add Photos
//             </button>
//             <button
//               onClick={handleDeletePhotos}
//               disabled={selectedPhotoIds.length === 0}
//               className="primary-button"
//               style={{ marginLeft: '10px' }}
//             >
//               Delete Selected Photos
//             </button>
//             <button
//               onClick={handleAssignPhotos}
//               disabled={selectedPhotoIds.length === 0}
//               className="primary-button"
//               style={{ marginLeft: '10px' }}
//             >
//               Move Selected Photos
//             </button>
//             <button 
//               onClick={handleDeleteAlbum} 
//               className="delete-button" 
//               style={{ marginLeft: '10px' }}
//             >
//               Delete Album
//             </button>
//             <button 
//               onClick={() => setIsEditMode(false)} 
//               className="cancel-button" 
//               style={{ marginLeft: '10px' }}
//             >
//               Exit Edit Mode
//             </button>
//           </div>
//         </>
//       )}

//       <motion.div initial="hidden" animate="visible" variants={containerVariants}>
//         <Masonry
//           breakpointCols={breakpointColumnsObj}
//           className="my-masonry-grid"
//           columnClassName="my-masonry-grid_column"
//         >
//           {album.photographs.length === 0 ? (
//             <p>No photographs in this album.</p>
//           ) : (
//             album.photographs.map((photo, index) => (
//               <motion.div
//                 key={photo.id}
//                 className="photo-card"
//                 variants={itemVariants}
//               >
//                 {isEditMode && (
//                   <input
//                     type="checkbox"
//                     className="photo-select-checkbox"
//                     checked={selectedPhotoIds.includes(photo.id)}
//                     onChange={() => toggleSelectPhoto(photo.id)}
//                   />
//                 )}

//                 <Image
//                   src={photo.thumbnail_url}
//                   alt={photo.title}
//                   width={photo.thumbnail_width}
//                   height={photo.thumbnail_height}
//                   layout="responsive"
//                   objectFit="contain"
//                   priority={false}
//                   onClick={() => openCarousel(index)}
//                 />
//               </motion.div>
//             ))
//           )}
//         </Masonry>
//       </motion.div>

//       <AnimatePresence>
//         {isCarouselOpen && (
//           <Modal
//             isOpen={isCarouselOpen}
//             onRequestClose={closeCarousel}
//             contentLabel="Photo Carousel"
//             className={`carousel-modal-content ${isFullscreen ? 'fullscreen' : ''}`}
//             overlayClassName="carousel-modal-overlay"
//             closeTimeoutMS={300}
//             shouldCloseOnOverlayClick={true}
//             id="carousel-modal" // Added ID for fullscreen reference
//           >
//             <motion.div
//               className={`carousel-modal ${isFullscreen ? 'fullscreen' : ''}`}
//               variants={modalVariants}
//               initial="hidden"
//               animate="visible"
//               exit="exit"
//               transition={{ duration: 0.3 }}
//             >
//               {/* Controls Container */}
//               <AnimatePresence>
//                 {showControls && (
//                   <motion.div
//                     className="gallery-btn-container"
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     exit={{ opacity: 0 }}
//                     transition={{ duration: 0.3 }}
//                   >
//                     <button
//                       onClick={() => {
//                         const elem = document.getElementById('carousel-modal');
//                         if (!isFullscreen) {
//                           elem.requestFullscreen().catch((err) => {
//                             console.error(`Error attempting to enable fullscreen mode: ${err.message} (${err.name})`);
//                           });
//                           setIsFullscreen(true);
//                         } else {
//                           document.exitFullscreen();
//                           setIsFullscreen(false);
//                         }
//                       }}
//                       className="fullscreen-toggle-button"
//                       aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
//                     >
//                       {isFullscreen ? <CloseFullscreenRoundedIcon className='close-fullscreen-toggle-button'/> : <OpenInFullRoundedIcon className='open-fullscreen-toggle-button'/>}
//                     </button>
//                     <button
//                       onClick={closeCarousel}
//                       className="gallery-close-button-container"
//                       aria-label="Close Carousel"
//                     >
//                       <CloseRoundedIcon className='gallery-close-button'/>
//                     </button>
//                   </motion.div>
//                 )}
//               </AnimatePresence>

//               {/* Image Gallery */}
//               <ImageGallery
//                 items={carouselImages}
//                 startIndex={currentIndex}
//                 showThumbnails={false}
//                 showPlayButton={false}
//                 showFullscreenButton={false}
//                 showNav={true}
//                 renderItem={(item) => {
//                   return (
//                     <div className="slider-layout">
//                       <div className="slider-image-container">
//                         <img src={item.original} alt={item.title} className="carousel-image" />
//                       </div>
//                       {!isFullscreen &&
//                         item.metadata &&
//                         (item.metadata.cameraModel ||
//                           item.metadata.lens ||
//                           item.metadata.exposure ||
//                           item.metadata.focalLength) && (
//                           <div className="slider-metadata-panel">
//                             <ul>
//                               {item.metadata.cameraModel && (
//                                 <li>
//                                   <span>Camera Model</span> <span>{item.metadata.cameraModel}</span>
//                                 </li>
//                               )}
//                               {item.metadata.lens && (
//                                 <li>
//                                   <span>Lens</span> <span>{item.metadata.lens}</span>
//                                 </li>
//                               )}
//                               {item.metadata.exposure && (
//                                 <li>
//                                   <span>Exposure</span> <span>{item.metadata.exposure}</span>
//                                 </li>
//                               )}
//                               {item.metadata.focalLength && (
//                                 <li>
//                                   <span>Focal Length</span> <span>{item.metadata.focalLength}</span>
//                                 </li>
//                               )}
//                             </ul>
//                           </div>
//                         )}
//                     </div>
//                   );
//                 }}
//               />
//             </motion.div>
//           </Modal>
//         )}
//       </AnimatePresence>

//       {/* Add Photos Modal */}
//       <AddPhotosModal
//         isOpen={isAddPhotosModalOpen}
//         onRequestClose={() => setIsAddPhotosModalOpen(false)}
//         albumId={Number(id)}
//         onPhotosAdded={fetchAlbum}
//       />

//       {/* Assign Photos Modal */}
//       <AssignPhotosModal
//         isOpen={isAssignModalOpen}
//         onRequestClose={() => {
//           setIsAssignModalOpen(false);
//           setSelectedTargetAlbum(null);
//         }}
//         availableAlbums={availableAlbums}
//         selectedTargetAlbum={selectedTargetAlbum}
//         setSelectedTargetAlbum={setSelectedTargetAlbum}
//         loadingAvailableAlbums={loadingAvailableAlbums}
//         handleConfirmAssignment={handleConfirmAssignment}
//         assigning={assigning}
//       />

//       {/* Create Album Modal */}
//       <CreateAlbumModal
//         isOpen={isCreateAlbumModalOpen}
//         onClose={() => setIsCreateAlbumModalOpen(false)}
//         onAlbumCreated={() => {
//           setIsCreateAlbumModalOpen(false);
//           // re-fetch album to show updated photos in the sidebar, if needed
//           fetchAlbum();
//         }}
//       />
//     </div>
//   );
// }

// // Use the custom layout
// AlbumPage.getLayout = function getLayout(page) {
//   return <PhotographerLayout>{page}</PhotographerLayout>;
// };


// pages/photographer/[id]/albums/[albumId].js

// pages/photographer/[id]/albums/[albumId].js

import { getSession } from 'next-auth/react'; // Ensure getSession is imported
import prisma from '../../../../lib/prisma'; // Adjust the path as necessary
import PhotographerLayout from '../../../../components/PhotographerLayout';
import AlbumDetail from '../../../../components/AlbumDetail'; // Ensure this component handles 'album.photographs' correctly

export default function AlbumPage({ album, photographerId, isOwner }) {
  return (
    <PhotographerLayout isOwner={isOwner} photographerId={photographerId}>
      <div className="album-page">
        <main>
          <AlbumDetail album={album} isOwner={isOwner} />
        </main>
        <style jsx>{`
          .album-page {
            display: flex;
          }
          main {
            flex: 1;
            padding: 20px;
            margin-left: 250px; /* Adjust based on sidebar width */
          }
        `}</style>
      </div>
    </PhotographerLayout>
  );
}

export async function getServerSideProps(context) {
  const { id, albumId } = context.query;

  // Fetch the session based on the incoming request
  const session = await getSession({ req: context.req });

  // Validate the IDs
  if (
    !id ||
    isNaN(Number(id)) ||
    !albumId ||
    isNaN(Number(albumId))
  ) {
    return { notFound: true };
  }

  try {
    const photographerIdNum = Number(id);
    const albumIdNum = Number(albumId);

    // Fetch the album directly using Prisma
    const album = await prisma.album.findUnique({
      where: { id: albumIdNum },
      include: {
        photographs: true,
        Photographer: true,
        Category: true,
        tags: true,
        likes: true,
        favourites: true,
      },
    });

    // Check if the album exists and belongs to the authenticated photographer
    if (!album || album.photographer_id !== photographerIdNum) {
      return { notFound: true };
    }

    // Determine if the current user is the owner
    const isOwner =
      session?.user?.role === 'photographer' &&
      session.user.id === photographerIdNum;

    // Serialize Date objects to strings
    const serializedAlbum = {
      ...album,
      created_at: album.created_at.toISOString(),
      updated_at: album.updated_at.toISOString(),
      photographs: album.photographs.map((photo) => ({
        ...photo,
        created_at: photo.created_at.toISOString(),
        updated_at: photo.updated_at.toISOString(),
      })),
    };

    return {
      props: {
        album: serializedAlbum,
        photographerId: photographerIdNum,
        isOwner,
      },
    };
  } catch (error) {
    console.error('Error fetching album:', error);
    return { notFound: true };
  }
}
