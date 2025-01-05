import React, { useRef, useState } from 'react';
import Cropper from 'react-cropper';
//import 'cropperjs/dist/cropper.css';
import axios from 'axios';

export const EnviaFotoMembro = () => {
  const cropperRef = React.useRef(null);
  const [image, setImage] = React.useState(null);
   const [crop, setCrop] = React.useState({ x: 0, y: 0 })
    const [zoom, setZoom] = React.useState(1.5)
  
    const onCropComplete = (croppedArea, croppedAreaPixels) => {
      console.log(croppedArea, croppedAreaPixels)
    }

  const onChange = (e) => {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(files[0]);
  };

  const getCroppedImage = () => {
    const cropper = cropperRef.current.cropper;
    cropper.getCroppedCanvas().toBlob((blob) => {
      const formData = new FormData();
      formData.append('image', blob);
      formData.append('cadastro', '999');
      axios.post('https://datasystem-ce.com.br/eOriente/api_eo_enviaFotoServidor.php', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.error('Erro ao enviar a imagem:', error);
      });
    });
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={onChange} />
      {image && (
        <Cropper
          src={image}
          //image={image}
          crop={crop}
          zoom={zoom}
          style={{ height: 400, width: '100%' }}
          // Cropper.js options
          initialAspectRatio={1}
          aspectRatio={1}
          guides={false}
          ref={cropperRef}
          
      
        />
      )}
      <button onClick={getCroppedImage}>Cortar e Enviar</button>
    </div>
  );
};