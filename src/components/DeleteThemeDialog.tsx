
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ThemeSettings } from "@/hooks/useTheme";

interface DeleteThemeDialogProps {
  theme: ThemeSettings | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (themeId: string, themeName: string) => void;
}

export default function DeleteThemeDialog({ 
  theme, 
  isOpen, 
  onClose, 
  onConfirm 
}: DeleteThemeDialogProps) {
  if (!theme) return null;

  const handleConfirm = () => {
    onConfirm(theme.id, theme.name);
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="bg-gray-800 border-gray-700">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-400">Excluir Tema</AlertDialogTitle>
          <AlertDialogDescription className="text-gray-300">
            Tem certeza que deseja excluir o tema "{theme.name}"? 
            Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-gray-700 border-gray-600 text-gray-200 hover:bg-green-600 hover:text-white hover:border-green-600">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirm}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
