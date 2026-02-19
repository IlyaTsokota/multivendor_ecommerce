'use client';

// Provider
import { useModal } from '@/providers/modal-provider';

// UI components
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogOverlay,
} from '@/components/ui/dialog';
import { DialogTitle } from '@radix-ui/react-dialog';
import { cn } from '@/lib/utils';

type Props = {
    heading?: string;
    subheading?: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
    maxWidth?: string;
};

const CustomModal = ({ children, defaultOpen, subheading, heading, maxWidth }: Props) => {
    const { isOpen, setClose } = useModal();
    return (
        <Dialog
            open={isOpen || defaultOpen}
            onOpenChange={() => {
                const cloudinaryIframe = document.querySelector('iframe[src*="cloudinary.com"]');

                if (!cloudinaryIframe) {
                    setClose();
                    return;
                }

                const cloudinaryOpen =
                    window.getComputedStyle(cloudinaryIframe)?.visibility === 'visible';

                if (cloudinaryOpen) {
                    return;
                }

                setClose();
            }}
        >
            <DialogOverlay className="pointer-events-none" />
            <DialogContent
                className={cn('overflow-y-scroll md:max-h-175 md:h-fit h-screen bg-card', maxWidth)}
            >
                <DialogHeader className="pt-8 text-left">
                    {heading && <DialogTitle className="text-2xl font-bold">{heading}</DialogTitle>}
                    {subheading && <DialogDescription>{subheading}</DialogDescription>}

                    {children}
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export default CustomModal;
