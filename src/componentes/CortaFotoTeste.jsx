import React from 'react';
import Croppie from 'react-croppie';
import 'croppie/croppie.css';

export const CortarFoto = () => {
  const [image, setImage] = React.useState(null);
  const [croppedImage, setCroppedImage] = React.useState(null);
  const croppieRef = React.useRef();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleCrop = () => {
    croppieRef.current.result({
      type: 'base64',
      size: 'viewport'
    }).then((croppedImage) => {
      setCroppedImage(croppedImage);
    });
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      {image && (
        <div>
          <Croppie
            ref={croppieRef}
            url={image}
            viewport={{ width: 200, height: 200 }}
            boundary={{ width: 300, height: 300 }}
          />
          <button onClick={handleCrop}>Confirmar</button>
        </div>
      )}
      {croppedImage && (
        <div>
          <h3>Imagem cortada:</h3>
          <img src={croppedImage} alt="Cropped" />
        </div>
      )}
    </div>
  );
};