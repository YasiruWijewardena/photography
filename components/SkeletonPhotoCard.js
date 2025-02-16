import React from 'react';
import { Card, CardContent, Skeleton } from '@mui/material';

export default function SkeletonPhotoCard() {
  return (
    <Card style={{ margin: '8px' }}>
      {/* This skeleton simulates the image area */}
      <Skeleton variant="rounded" width="100%" height={200} animation="wave" />
    </Card>
  );
}