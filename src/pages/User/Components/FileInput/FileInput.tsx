import { useRef } from 'react'
import { toast } from 'react-toastify'
import config from 'src/constants/config'

function FileInput({ setFile }: { setFile: (value: React.SetStateAction<File | undefined>) => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const localFile = event.target.files?.[0]
    // fileInputRef.current?.setAttribute('value', '')
    console.log(fileInputRef.current?.value)
    // console.log(localFile?.type)
    if (localFile && (localFile.size >= config.maxSizeUploadAvatar || !localFile.type.includes('image'))) {
      toast.error('Dụng lượng file tối đa 1 MB. Định dạng:.JPEG, .PNG')
    } else {
      setFile && setFile(localFile)
    }
  }

  const handleUploadAvatar = () => {
    fileInputRef.current?.click()
  }

  return (
    <>
      <input
        type='file'
        accept='.jpg, .jpeg, .png'
        className='hidden'
        ref={fileInputRef}
        onChange={onFileChange}
        onClick={(e) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ;(e.target as any).value = ''
        }}
      />
      <button
        type='button'
        onClick={handleUploadAvatar}
        className='rounded-sm border border-gray-300 px-5 py-3 text-sm text-gray-700 duration-100 hover:bg-gray-50'
      >
        Chọn ảnh
      </button>
    </>
  )
}

export default FileInput
