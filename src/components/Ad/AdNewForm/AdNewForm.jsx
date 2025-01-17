import React, { useState,useEffect } from "react";
import {useHistory} from "react-router-dom";
import {adService} from 'services/ads.service'
import { mediaService } from "services/medias.service";
import {authService} from "services/auth.service";
import Category from "components/Category/Category";
import DropzoneAreaComponent from "./DropzoneArea";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button, Stack,
    FormLabel,RadioGroup,FormControlLabel,Radio,TextField} from '@mui/material';
import { notificationService } from "services/notifications.service";



const AdNewForm = () => {

    const history = useHistory()
    const currentUser = authService.getCurrentUser();
    const [id_user, setIdUser] = useState(0)

    if(!currentUser || authService.getRoleCurrentUser() === "limite"){
        history.push('/')
    }
    

    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [price,setPrice] = useState(0) 
    const [type, setType] = useState("")
    const [id_category,setCategory] = useState(0)
    const [isPaying, setIsPaying]= useState(false)
    const [displayed_picture,setDisplayedPicture] = useState(0)
    const currentDate = new Date();
    const date = `${currentDate.getDate()}/${currentDate.getMonth()+1}/${currentDate.getFullYear()}`;
    const [medias,setMedias] = useState([]);

    useEffect(()=>{
        const fetchData = async ()=>{
            if(currentUser){
                setIdUser(currentUser.id_user);
            }           
        }
        fetchData();
    },[]);

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
       
    }

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
        
    }
    
    const handleIsPaying =(e)=>{
        if(e.target.value==="isPaying"){
            setIsPaying(true)
            setType("a vendre")
        }else{
            setIsPaying(false)
            setType("a donner")
        }
    }
    
    const handlePriceChange =(e)=>{
        setPrice(parseInt(e.target.value));
 
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if(medias.length<1){
            toast.error('Erreur : Media requis !', {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'colored'
            });
            return
        }else{
            let img = false;
            medias.map((media)=>{
                if(media['type'].includes('image')){
                    img=true;
                    return;
                }
            })
            if(!img){
                toast.error('Erreur : Il faut au moins 1 image !', {
                    position: "bottom-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: 'colored'
                });
                return
            }
        }
        if(id_category===0){
            toast.error('Erreur : Categorie requise !', {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'colored'
                });
            return
        }

        let idToast = toast.loading("Ajout de l'annonce",{position: "bottom-right"})

        setDisplayedPicture(0)   
        const newAd = {
            date,
            description,
            displayed_picture,
            id_category,
            price,
            state: "en attente",
            title,
            type,
            id_user        
        };
        console.log(newAd)
        adService.createNewAd(newAd)
        .then(async res=>{
            await addMedia(res.id_ad, id_user)
            let currentDate = new Date();
            let date = `${currentDate.getDate()}/${currentDate.getMonth()+1}/${currentDate.getFullYear()}-${currentDate.getHours()}:${currentDate.getMinutes()}`;
            let newNotif = {
                message:"Votre annonce ''"+title+"'' a été crée",
                date:date,
                id_user:id_user
            }
            await notificationService.createNotification(newNotif);
            toast.update(idToast,{
                render: 'Annonce ajoutée !',
                type: "success",
                isLoading: false,
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'colored'
            });
            history.push("/")
        })
        setMedias([]);
        setTitle("");
        setDescription("");
        setPrice(0);
        setCategory(0);
    }

    const addMedia=async (id_ad, id_user)=>{
        const mediaPromise = medias.map(async (media)=>{
            let urlMedia = await mediaService.UploadMedias(media, id_user);
            let newMedia = {}
            if(media['type'].includes('video')){
                newMedia = {
                    url:urlMedia,
                    type:'video',
                    id_ad,
                }
            }else if(media['type'].includes('image')){
                newMedia = {
                    url:urlMedia,
                    type:'image',
                    id_ad,
                }
            }
            await mediaService.createNewMedia(newMedia);
        })
        await Promise.all(mediaPromise);
        let mediasChild = await mediaService.getByAdId(id_ad);
        await mediasChild.map(async (mediaChild)=>{
            if(mediaChild.type==="image"){
                const newAd = {
                    date,
                    description,
                    displayed_picture: mediaChild.id_media,
                    id_category,
                    price,
                    state: "en attente",
                    title,
                    type,
                    id_user        
                };
                await adService.update(id_ad, newAd)
                return
            }
        })
    }

    const showAddPrice=()=>{

            return(
            <div>
                <TextField
                    fullWidth
                    id="outlined-number"
                    label="Prix de l'annonce"
                    type="number"
                    onChange={handlePriceChange}
                    required        
                />
            </div>
            )
    }
    
    return (
        <form onSubmit={handleSubmit}>
            <Stack spacing={5}>
                <TextField
                    label="Titre de l'annonce"
                    placeholder="Entrez un titre pour votre annonce"
                    onChange={handleTitleChange}
                    required
                    
                    
                    />
                <TextField
                    label="Description de l'annonce"
                    placeholder="Entrez une description pour votre annonce"
                    onChange={handleDescriptionChange}
                    multiline
                    rows={3}
                    required
                />
                <Category setCategory={setCategory}/>
                <FormLabel component="legend">Type d'annonce</FormLabel>
            </Stack> 
            <RadioGroup row aria-label="adType" name="controlled-radio-buttons-group"
                 onChange={handleIsPaying}   
            >
            <FormControlLabel value="isFree" control={<Radio required={true} />} label="A donner" aria-required />
            <FormControlLabel value="isPaying" control={<Radio required={true}/>} label="A vendre" aria-required />
            </RadioGroup>
            {isPaying && showAddPrice()}
            <DropzoneAreaComponent setMedias={setMedias} medias={medias}/>  <br/>
            <Button variant="contained" size="medium" type="submit">Créer</Button> 
            <ToastContainer/>
        </form> 
    )
}

export default AdNewForm

/*

            <form onSubmit={handleSubmit}>    
            <InputLabel variant="standard" htmlFor="uncontrolled-native">
                Entrez un titre pour votre annonce <input type="text" value={title} onChange={handleTitleChange} required/> 
                   Entrez une description pour votre annonce <input type="textarea" value={description} onChange={handleDescriptionChange} required/>
  
                    <div onChange={event=>handleIsPaying(event)}>
                        A donner <input type="radio" name="type" value="isFree" required/>
                        A vendre <input type="radio" name="type" value="isPaying" required/>
                    </div>
                     {isPaying && showAddPrice()}
                     <DropzoneAreaComponent setMedias={setMedias} medias={medias}/>
                 <Button variant="contained" size="medium" type="submit">Créer</Button>     
            </form>
          <ToastContainer/>

                   */


