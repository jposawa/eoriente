import React from 'react';
import './EnviaFotoMembro.css'
import { toast } from 'react-toastify';
import Cropper from 'react-easy-crop'
//import Cropper from 'react-cropper';
import axios from 'axios';
//import './styles.css'

export const EnviaFotoMembro = (props) => {
  const { cadastro, onClose, carregaLista } = props;
  const [file, setFile] = React.useState(null);
  const hiddenFileInput = React.useRef(null);
  const [crop, setCrop] = React.useState({ x: 0, y: 0 })
  const [zoom, setZoom] = React.useState(1.5)
  const [image, setImage] = React.useState("");

  const arquivo = React.createRef();
  const imagem = React.useRef();
  const cropperRef = React.useRef(null);

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    console.log(croppedArea, croppedAreaPixels)
  }

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  }

  const handleClick = event => {
    hiddenFileInput.current.click();
  }
  const fechaModal = () => {
    setFile(null);
    onClose();
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { target } = e; // pegar os inputs

    const formData = new FormData();
    formData.append('image', file);
    formData.append('cadastro', cadastro);

    try {
      const response = axios.post('https://datasystem-ce.com.br/eOriente/api_eo_enviaFotoServidor.php', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        //   console.log('Success:', result);
        carregaLista();
        toast.success(result);
        fechaModal();
      } else {
        console.error('Error:', response.statusText);
        toast.warning(result);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
      <div className='containerFormEnviaFotoMembro'>
        <h3 className='tituloEnviaFotoMembro'>Enviando Foto Membro</h3>
        <form onSubmit={handleSubmit}>
          <input type="file" name='enviaFoto' ref={hiddenFileInput} onChange={handleFileChange} />

          <button type='button' className='bt_selArqEnviaFotoMembro' onClick={handleClick}>
            Selecione Arquivo
          </button>

          {!!file ?
            <button className='bt_envEnviaFotoMembro' type="submit">Enviar Foto</button>
            : null}
        </form>
      </div>
      <button className='bt_cancEnviaFotoMembro' type="reset" onClick={fechaModal}>Cancelar</button>
      {!!file ?
        <Cropper
          //image={'https://datasystem-ce.com.br/eOriente/fotosMembros/f999_10.jpg'}
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={1}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
        />
        : null}
    </>
  );
}