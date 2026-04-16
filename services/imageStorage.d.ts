import type { Problem } from '../types';

export function createImageRef(id: string): string;
export function isImageRef(value: string | null | undefined): boolean;
export function isInlineImageData(value: string | null | undefined): boolean;
export function hasInlineImageBlocks(problems: Problem[]): boolean;
export function saveImageBlob(blob: Blob): Promise<string>;
export function saveDataUrlImage(dataUrl: string): Promise<string>;
export function loadImageBlob(ref: string): Promise<Blob | null>;
export function migrateInlineImageBlocks(
  problems: Problem[],
  storeInlineImage?: (dataUrl: string) => Promise<string>
): Promise<{ changed: boolean; problems: Problem[] }>;
