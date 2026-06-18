import { useUserContext } from '../context/UserContext';

// Wrapper tipis agar semua komponen yang sudah pakai useUser tidak perlu diubah
export const useUser = () => useUserContext();