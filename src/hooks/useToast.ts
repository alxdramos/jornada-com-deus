import { toast } from "sonner";

export function useToast() {
  const success = (message: string, options?: any) => {
    toast.success(message, {
      duration: 4000,
      style: {
        background: "#F0FDF4",
        border: "1px solid #86EFAC",
        borderRadius: "16px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      },
      ...options,
    });
  };

  const error = (message: string, options?: any) => {
    toast.error(message, {
      duration: 5000,
      style: {
        background: "#FEF2F2",
        border: "1px solid #FCA5A5",
        borderRadius: "16px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      },
      ...options,
    });
  };

  const warning = (message: string, options?: any) => {
    toast.warning(message, {
      duration: 4000,
      style: {
        background: "#FFFBEB",
        border: "1px solid #FCD34D",
        borderRadius: "16px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      },
      ...options,
    });
  };

  const info = (message: string, options?: any) => {
    toast.info(message, {
      duration: 4000,
      style: {
        background: "#EFF6FF",
        border: "1px solid #93C5FD",
        borderRadius: "16px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      },
      ...options,
    });
  };

  const prayerSaved = () => {
    success("Oração salva com sucesso! 🙏", {
      description: "Sua oração foi adicionada à sua coleção pessoal.",
    });
  };

  const entrySaved = () => {
    success("Entrada salva no diário! 📝", {
      description: "Sua reflexão foi registrada com sucesso.",
    });
  };

  const favoriteAdded = (item: string) => {
    success(`${item} adicionado aos favoritos! ❤️`);
  };

  const favoriteRemoved = (item: string) => {
    info(`${item} removido dos favoritos`);
  };

  const dayCompleted = () => {
    success("Dia concluído! Glória a Deus 🙌", {
      duration: 6000,
      description: "Parabéns por completar seu devocional diário!",
    });
  };

  const offlineMode = () => {
    warning("Modo offline ativado", {
      description: "Algumas funcionalidades podem não estar disponíveis.",
      duration: 5000,
    });
  };

  const onlineRestored = () => {
    success("Conexão restaurada! 🌐", {
      description: "Todas as funcionalidades estão disponíveis novamente.",
    });
  };

  return {
    success,
    error,
    warning,
    info,
    prayerSaved,
    entrySaved,
    favoriteAdded,
    favoriteRemoved,
    dayCompleted,
    offlineMode,
    onlineRestored,
  };
}