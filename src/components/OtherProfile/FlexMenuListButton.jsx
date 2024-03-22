import { useEffect, useState } from "react";
import images from '../../assets/images/index'
// list menu
const options = [
    'Photo',
    'Document',
    'Audio',
    'Note',
    'Email'
]

export default function FlexMenu() {
    const [selectedIndex, setSelectedIndex] = useState(0);


    const [listPhoto, setListPhoto] = useState([]);

    useEffect(() => {
        if (listPhoto.length == 0 && selectedIndex == 0) {
            // fetch data
            // setListPhoto(data)
        }
    }, [selectedIndex])

    return (
        <div className="flex flex-col gap-3">
            <div className="flex max-sm:overflow-x-scroll">
                {options.map((option, index) => {
                    return (
                        <button onClick={() => { if (index != selectedIndex) { setSelectedIndex(index) } }} key={index} className={`px-3 py-2 ${selectedIndex == index ? 'relative text-blue-600 after:absolute after:w-full after:h-[2px] after:bg-blue-600 after:left-0 after:bottom-0 after:rounded-lg' : ''}`}>
                            {option}
                        </button>
                    )
                })}
            </div>
            {/* menu content */}
            <div className="grid grid-flow-row sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid-cols-4 gap-3">
                {/* uncomment when api is ready */}
                {/* {listPhoto.map((photo, index) => {
                    return (
                        <div className="flex flex-col gap-2" key={index}>
                            <img className="aspect-square" src={photo.src} alt="a picture" />
                            <div className="py-2 flex justify-center items-center">
                                <p className="text-4xl">24/2/2024</p>
                            </div>
                        </div>
                    )
                })} */}
                <div className="flex flex-col gap-2">
                    <img className="aspect-square" src={images.profileTestImage} alt="a picture" />
                    <div className="py-2 flex justify-center items-center">
                        <p className="text-2xl">24/2/2024</p>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <img className="aspect-square" src={images.profileTestImage} alt="a picture" />
                    <div className="py-2 flex justify-center items-center">
                        <p className="text-2xl">24/2/2024</p>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <img className="aspect-square" src={images.profileTestImage} alt="a picture" />
                    <div className="py-2 flex justify-center items-center">
                        <p className="text-2xl">24/2/2024</p>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <img className="aspect-square" src={images.profileTestImage} alt="a picture" />
                    <div className="py-2 flex justify-center items-center">
                        <p className="text-2xl">24/2/2024</p>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <img className="aspect-square" src={images.profileTestImage} alt="a picture" />
                    <div className="py-2 flex justify-center items-center">
                        <p className="text-2xl">24/2/2024</p>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <img className="aspect-square" src={images.profileTestImage} alt="a picture" />
                    <div className="py-2 flex justify-center items-center">
                        <p className="text-2xl">24/2/2024</p>
                    </div>
                </div>
            </div>

        </div>
    )
}