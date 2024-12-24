// components/AlbumDetail.js

import AlbumView from './AlbumView';

export default function AlbumDetail({ album, isOwner }) {
  return (
    <div className="album-detail">
      <AlbumView album={album} isOwner={isOwner} />
    </div>
  );
}
