import React from 'react';
import './EnviaFotoMembro.css'
import { toast } from 'react-toastify';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../compartilhados/funcoes';
import { AMBIENTE, URL_FOTOS_MEMBROS } from '../compartilhados/constantes';
//import Slider from "@material-ui/core/Slider";
//import Cropper from 'react-cropper';
//import './styles.css'

export const EnviaFotoMembro = (props) => {
  const { dadosMembro, onClose, carregaLista, arquivoFoto } = props;
  const [file, setFile] = React.useState(null);
  const hiddenFileInput = React.useRef(null);
  const [crop, setCrop] = React.useState({ x: 0, y: 0 })
  const [zoom, setZoom] = React.useState(1)
  const [image, setImage] = React.useState(null);
  const [imagemCortadaPixels, setImagemCortadaPixels] = React.useState(null);
  const [cropper, setCropper] = React.useState(null);
  const [rotation, setRotation] = React.useState(0);

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    //  console.log(croppedArea, croppedAreaPixels)
    setImagemCortadaPixels(croppedAreaPixels);
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
    setImage(null);
    onClose();
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { target } = e; // pegar os inputs
    const croppedImage = await getCroppedImg(
      image,
      imagemCortadaPixels
    )

    // tranformando de Blob para imagem jpg
    const novoFile = await fetch(croppedImage).then(r => r.blob()).then(blobFile => new File([blobFile], file.name, { type: blobFile.type }))
    ///////////////////////

    const formData = new FormData();
    formData.append('image', novoFile);
    formData.append('cadastro', dadosMembro?.cad);
    formData.append('ambiente', AMBIENTE);

    try {
      const response = await fetch('https://datasystem-ce.com.br/eOriente/api_eo_enviaFotoServidor.php', {
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
        toast.warning('Erro no envio. Verifique sua conexão.');
      }
    } catch (error) {
      console.error('Erro:', error);
      toast.warning('Erro no envio: ' | error);
    }
  };

  return (
    <>
      <div className='containerFormEnviaFotoMembro'>
        <h3 className='tituloEnviaFotoMembro'>Enviando Foto Membro</h3>
        <img className='fotoAtual' src={`${URL_FOTOS_MEMBROS}${dadosMembro?.arqFoto}`} />
        <h4>{dadosMembro?.nome}</h4>
        <form onSubmit={handleSubmit}>
          <input type="file" ref={hiddenFileInput} onChange={handleFileChange} />

          <button type='button' className='bt_selArqEnviaFotoMembro' onClick={handleClick}>
            Selecionar outra foto
          </button>

          {!!file ?
            <button className='bt_envEnviaFotoMembro' type="submit">Enviar Foto</button>
            : null}

          <button className='bt_cancEnviaFotoMembro' type="reset" onClick={fechaModal}>Cancelar</button>
        </form>
      </div>

      {!!image ?
        <div className="crop-container">
          <Cropper
            image={image}
            cropShape="round"
            rotation={0}
            crop={crop}
            zoom={zoom}
            zoomSpeed={1}
            maxZoom={5}
            minZoom={0.5}
            zoomWithScroll={true}
            showGrid={true}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            cropSize={{ width: 120, height: 120 }}
            onCropComplete={onCropComplete}
          />
        </div>
        : null}
      {/*!!image ?
      <div className="controls">
        <label>
          Zoom
          <Slider
            value={zoom}
            min={1}
            max={4}
            step={0.1}
            aria-labelledby="zoom"
            onChange={(e, zoom) => setZoom(zoom)}
            className="range"
          />
        </label>
        <label>
            Rotação
            <Slider
              value={rotation}
              min={0}
              max={360}
              step={1}
              aria-labelledby="rotate"
              onChange={(e, rotation) => setRotation(rotation)}
              className="range"
            />
          </label>
      </div>
      : null*/}
    </>
  );
}