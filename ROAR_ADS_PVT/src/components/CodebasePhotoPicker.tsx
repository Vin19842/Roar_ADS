import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { GalleryImage } from "@/lib/siteData";

interface CodebasePhotoPickerProps {
  kind: "banner" | "gallery";
  photos: GalleryImage[];
  loading: boolean;
  failed: boolean;
  onRefresh: () => void;
  onSelect: (photo: GalleryImage) => void;
}

export default function CodebasePhotoPicker({ kind, photos, loading, failed, onRefresh, onSelect }: CodebasePhotoPickerProps) {
  const [selectedSrc, setSelectedSrc] = useState("");
  const selected = photos.find((photo) => photo.src === selectedSrc) ?? photos[0];
  const prefix = `manage-${kind}-local`;

  return <div className="manage-local-photos" data-testid={`${prefix}-picker`}>
    <div className="manage-local-heading">
      <label htmlFor={`${prefix}-select`} data-testid={`${prefix}-label`}>Photos from the codebase</label>
      <Button variant="ghost" size="sm" onClick={onRefresh} disabled={loading} data-testid={`${prefix}-refresh-button`}>Refresh</Button>
    </div>
    <p className="manage-help" data-testid={`${prefix}-help`}>Add files to <code>frontend/public/stills/</code>, then refresh this list.</p>
    {failed ? <p role="alert" data-testid={`${prefix}-error`}>Could not load local photos. Refresh to try again.</p>
      : loading ? <p data-testid={`${prefix}-loading`}>Loading local photos…</p>
      : !selected ? <p data-testid={`${prefix}-empty`}>No local photos yet. Add a JPG, PNG, WebP or AVIF file to the folder above.</p>
      : <>
        <select id={`${prefix}-select`} value={selected.src} onChange={(event) => setSelectedSrc(event.target.value)} data-testid={`${prefix}-select`}>
          {photos.map((photo, index) => <option key={photo.id} value={photo.src} data-testid={`${prefix}-option-${index + 1}`}>{decodeURIComponent(photo.src.slice("/stills/".length))}</option>)}
        </select>
        <div className="manage-local-preview">
          <img src={selected.src} alt={selected.title} loading="lazy" data-testid={`${prefix}-preview-image`} />
          <div><span data-testid={`${prefix}-path`}>{selected.src}</span><Button variant="outline" size="sm" onClick={() => onSelect(selected)} data-testid={`${prefix}-add-button`}>{kind === "gallery" ? "Use in Our Story" : "Add banner"}</Button></div>
        </div>
      </>}
  </div>;
}