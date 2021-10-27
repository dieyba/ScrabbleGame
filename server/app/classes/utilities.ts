// TODO: déménager les fonctions/enum/constantes/etc concernés ici

export enum Axis {
    H = 'h',
    V = 'v',
}
// eslint-disable-next-line no-unused-vars
export const invertAxis = {
    [Axis.H]: Axis.V,
    [Axis.V]: Axis.H, // Vertical is the opposite of horizontal
};
