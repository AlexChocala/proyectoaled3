// import { Injectable } from '@angular/core';
import { inject } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { Firestore, getFirestore, collection, getDocs, addDoc, deleteDoc, doc, updateDoc, query, orderBy, onSnapshot, setDoc, getDoc, where } from 'firebase/firestore';

export class FirestoreService<T extends { id?: string }> {
  private app = inject(FirebaseApp);
  private db: Firestore = getFirestore(this.app);
  public datos: T[] = [];

  constructor(private tabla: string) { }

  async listar(): Promise<void> {
    this.datos = []; //PROBAR
    const querySnapshot = await getDocs(collection(this.db, this.tabla));
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (data) {
        this.datos.push({ id: docSnap.id, ...(data as T) });
      }
    });
  }

  async listarOrdenado(campo: string = 'timestamp'): Promise<void> {
    this.datos = [];
    const q = query(collection(this.db, this.tabla), orderBy(campo));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(docSnap => {
      const data = docSnap.data();
      if (data) this.datos.push({ id: docSnap.id, ...(data as T) });
    });
  }

  async agregar(dato: Omit<T, 'id'>): Promise<void> {
    try {
      const docRef = await addDoc(collection(this.db, this.tabla), dato);
      this.datos.push({ ...dato, id: docRef.id } as T);
    } catch (e) {
      console.error(`Error al agregar en ${this.tabla}:`, e);
    }
  }

  async guardarConId(id: string, dato: Omit<T, 'id'>): Promise<void> {
    try {
      const ref = doc(this.db, this.tabla, id);
      const existente = await getDoc(ref);
      if (existente.exists()) {
        console.warn(`Ya existe un documento con ID ${id}`);
        return;
      }
      const nuevoDato = { ...dato, id } as T;
      await setDoc(ref, dato);
      this.datos.push(nuevoDato);
    } catch (e) {
      console.error(`Error al guardar con ID en ${this.tabla}:`, e);
    }
  }

  async obtenerPorId(id: string): Promise<T | null> {
    try {
      const ref = doc(this.db, this.tabla, id);
      const docSnap = await getDoc(ref);
      if (docSnap.exists()) {
        const data = docSnap.data();
        return { id: docSnap.id, ...(data as T) };
      } else {
        console.warn(`No se encontró el documento con ID: ${id}`);
        return null;
      }
    } catch (e) {
      console.error(`Error al obtener documento en ${this.tabla}:`, e);
      return null;
    }
  }

  async eliminar(id: string): Promise<void> {
    try {
      await deleteDoc(doc(this.db, this.tabla, id));
      this.datos = this.datos.filter(item => item.id !== id);
    } catch (e) {
      console.error(`Error al eliminar en ${this.tabla}:`, e);
    }
  }

  async modificar(nuevosDatos: T): Promise<void> {
    try {
      if (!nuevosDatos.id) throw new Error('El documento no tiene ID definido');

      const ref = doc(this.db, this.tabla, nuevosDatos.id);
      const { id, ...datosSinId } = nuevosDatos;
      await updateDoc(ref, datosSinId);

      this.datos = this.datos.map(item =>
        item.id === id ? { ...item, ...datosSinId } : item
      );
    } catch (e) {
      console.error(`Error al modificar en ${this.tabla}:`, e);
    }
  }

  // TIEMPO REAL
  escuchar(callback: (datos: T[]) => void): void {
    const q = query(collection(this.db, this.tabla), orderBy('timestamp'));
    onSnapshot(q, snapshot => {
      const nuevosDatos: T[] = [];
      snapshot.forEach(docSnap => {
        const data = docSnap.data();
        if (data) nuevosDatos.push({ id: docSnap.id, ...(data as T) });
      });
      this.datos = nuevosDatos;
      callback(nuevosDatos);
    });
  }

  async buscarPorCampo(campo: keyof T, valor: any): Promise<T[]> {
    try {
      const q = query(collection(this.db, this.tabla), where(campo as string, '==', valor));
      const querySnapshot = await getDocs(q);

      const resultados: T[] = [];
      querySnapshot.forEach(docSnap => {
        const data = docSnap.data();
        if (data) {
          resultados.push({ id: docSnap.id, ...(data as T) });
        }
      });

      return resultados;
    } catch (e) {
      console.error(`Error al buscar por campo "${String(campo)}" en ${this.tabla}:`, e);
      return [];
    }
  }

}
