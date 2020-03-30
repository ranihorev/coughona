declare module 'detectrtc' {
  export const hasMicrophone: boolean;
  export const isWebsiteHasMicrophonePermissions: boolean;
  export function load(cb: () => void): void;
}
