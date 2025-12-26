import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import api from "@/lib/api";

interface DeleteCategoryModalProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    onClose?: () => void;
    categoryId?: string | number;
    onDeleted?: (categoryId: string | number) => void;
}

export default function DeleteCategoryModal({
    open,
    onOpenChange,
    onClose,
    categoryId,
    onDeleted,
}: DeleteCategoryModalProps) {
    const handleDelete = async () => {
        if (!categoryId) return;
        try {
            await api.delete(`/category/${categoryId}`);
            onDeleted?.(categoryId);
        } catch (error) {
            console.error("Erro ao deletar categoria:", error);
        } finally {
            onOpenChange?.(false);
            onClose?.();
        }
    }

    const handleOpenChange = (nextOpen: boolean) => {
        onOpenChange?.(nextOpen);
        if (!nextOpen) {
            onClose?.();
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Deseja deletar esta categoria?</DialogTitle>
                    <DialogDescription>Tem certeza que deseja deletar esta categoria? Esta ação não pode ser desfeita.</DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <Button variant="secondary" onClick={onClose}>Cancelar</Button>
                    <Button variant="destructive" onClick={handleDelete}>Deletar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
