import Image from 'next/image';
import { FC, useEffect, useState } from 'react';

interface ImageUploadProps {
    disabled?: boolean;
    onChange: (value: string) => void;
    onRemove: (value: string) => void;
    value: string[];
    type: 'standard' | 'profile' | 'cover';
    notShowPreview?: boolean;
}

const ImageUpload: FC<ImageUploadProps> = ({
    onChange,
    onRemove,
    value,
    type,
    disabled,
    notShowPreview,
}) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    if (type === 'profile') {
        return (
            <div className="relative rounded-full w-52 h-52 insert-x-96 bg-gray-200 border-2 border-white shadow-2xl">
                {/* prettier-ignore */}
                {value?.length > 0 ? (
                    <Image src={value[0]} alt="" width={300} height={300} className="w-52" />
                ) : null}
            </div>
        );
    } else {
        return <div></div>;
    }
};

export default ImageUpload;
