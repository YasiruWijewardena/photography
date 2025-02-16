import React from 'react';
import { Card, CardContent, Skeleton } from '@mui/material';

export default function SkeletonAlbumCard() {
  return (
    <Card style={{ margin: '8px' }}>
      <CardContent>
        <Skeleton variant="circular" width={40} height={40} />
        <Skeleton variant="text" width="80%" animation="wave" />
      </CardContent>
      
      <Skeleton variant="rounded" width="100%" height={200} animation="wave" />
    </Card>
  );
}