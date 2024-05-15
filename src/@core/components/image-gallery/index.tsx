import React from 'react';
import { Box } from '@mui/material';
import { Media } from 'src/@core/types';

interface VerticalImageGalleryProps {
  medias: Media[];
}

const VerticalImageGallery: React.FC<VerticalImageGalleryProps> = ({ medias }) => {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" width="100%" flexDirection="column">
      {medias.map((media, index) => (
        <img
          key={index}
          src={media.signed_url}
          alt={`Media ${index}`}
          style={{
            maxWidth: '100%',
            height: 'auto',
            maxHeight: '80vh',
            margin: '0 auto',
          }}
        />
      ))}
    </Box>
  );
};

export default VerticalImageGallery;
