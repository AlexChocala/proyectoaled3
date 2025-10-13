export interface CampoValidacion {
  campo: string;
  min: number;
  max: number;
  patron: RegExp;
  mensaje: string;
}
