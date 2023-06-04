import useUploadModal from "@/hooks/useUploadModal";
import Modal from "./Modal";
import { useForm, FieldValues, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import Input from "./Input";
import Button from "./Button";
import { toast } from "react-hot-toast";
import { useUser } from "@/hooks/useUser";
import uniqid from "uniqid";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";


// upload modal
const UploadModal = () => {
    // upload modal hook
    const uploadModal = useUploadModal()
    // get user
    const { user } = useUser()
    // supabase client
    const supabaseClient = useSupabaseClient()
    // get router
    const router = useRouter()
    // loading state
    const [isLoading, setIsLoading] = useState(false)
    // form hook
    const {
        register, handleSubmit,
        reset
    } = useForm<FieldValues>({
        defaultValues: {
            author: '',
            title: '',
            album: '',
            song: null,
            image: null
        }
    })

    // upload modal handle
    const onChange = (open: boolean) => {
        // if not opened
        if(!open) {
            // reset form
            reset()
            // close modal
            uploadModal.onClose()
        }
    }

    // submit handle
    const onSubmit: SubmitHandler<FieldValues> = async (values) => {
        try {
            // set loading
            setIsLoading(true)

            // get input data
            const imageFile = values.image?.[0]
            const songFile = values.song?.[0]

            // id no data and user
            if(
                !user || !imageFile || !songFile
            ) {
                // display msg
                return toast.error('Missing fields')
            }

            // create an unique id
            const uniqueID = uniqid()

            // upload song
            const {
                data: songData,
                error: songError
            } = await supabaseClient.storage.from('songs').upload(
                `song-${values.title}-${uniqueID}`, songFile, {
                    cacheControl: '3600',
                    upsert: false
                }
            )

            // if song upload error
            if(songError) {
                // set loading
                setIsLoading(false)

                // return toast
                return toast.error('Failed song upload')
            }

            // upload image
            const {
                data: imageData,
                error: imageError
            } = await supabaseClient.storage.from('images').upload(
                `image-${values.title}-${uniqueID}`, imageFile, {
                    cacheControl: '3600',
                    upsert: false
                }
            )

            // if song upload error
            if(imageError) {
                // set loading
                setIsLoading(false)

                // return toast
                return toast.error('Failed image upload')
            }

            // create record on db if everything went ok
            const {
                error: supabaseError
            } = await supabaseClient.from('songs').insert({
                user_id: user.id,
                title: values.title,
                album: values.album,
                author: values.author,
                image_path: imageData.path,
                song_path: songData.path
            })

            // if any error
            if(supabaseError) {
                // set loading
                setIsLoading(false)

                // return toast
                return toast.error(supabaseError.message)
            }

            // refresh page
            router.refresh()
            // display success msg
            toast.success('Song created!')
            // reset form
            reset()
            // close modal
            uploadModal.onClose()
        } catch (error) {
            // display msg
            toast.error('Something went wrong!')
        } finally {
            // set loading
            setIsLoading(false)
        }
    }

    // render content
    return (
        <Modal
            title="Add a song"
            description="Upload an mp3 file"
            isOpen={uploadModal.isOpen}
            onChange={onChange}
        >
            <form className="flex flex-col gap-y-4"
                onSubmit={handleSubmit(onSubmit)}
            >
                <Input
                    id='title'
                    disabled={isLoading}
                    {...register('title', { required: true })}
                    placeholder='Song title'
                />
                <Input
                    id='album'
                    disabled={isLoading}
                    {...register('album', { required: true })}
                    placeholder='Song album'
                />
                <Input
                    id='author'
                    disabled={isLoading}
                    {...register('author', { required: true })}
                    placeholder='Song author'
                />
                <div>
                    <div className="pb-1">
                        Select a song file
                    </div>
                    <Input
                        id='song'
                        type='file'
                        disabled={isLoading}
                        accept='.mp3'
                        {...register('song', { required: true })}
                    />
                </div>
                <div>
                    <div className="pb-1">
                        Select an image
                    </div>
                    <Input
                        id='image'
                        type='file'
                        disabled={isLoading}
                        accept='image/*'
                        {...register('image', { required: true })}
                    />
                </div>
                <Button
                    disabled={isLoading}
                    type="submit"
                >
                    Create
                </Button>
            </form>
        </Modal>
    );
}
 
export default UploadModal;
