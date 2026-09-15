import { useState, type ChangeEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowDown, ArrowLeft, ArrowUp, ImagePlus, Plus, Save, Trash2, Video } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import CodebasePhotoPicker from "@/components/CodebasePhotoPicker";
import { apiGet, apiPut } from "@/lib/api";
import { DEFAULT_SITE_CONTENT } from "@/lib/siteData";
import type { GalleryImage, SiteContent } from "@/lib/siteData";

const clone = (content: SiteContent): SiteContent => JSON.parse(JSON.stringify(content)) as SiteContent;

export default function Manage() {
  const queryClient = useQueryClient();
  const contentQuery = useQuery({ queryKey: ["site-content"], queryFn: () => apiGet<SiteContent>("/site-content"), retry: false });
  const localPhotosQuery = useQuery({ queryKey: ["site-photos"], queryFn: () => apiGet<GalleryImage[]>("/site-photos"), retry: false });
  const [draft, setDraft] = useState<SiteContent | null>(null);
  const [categoryId, setCategoryId] = useState("documentaries");
  const [newVideoTitle, setNewVideoTitle] = useState("");
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [newBannerUrl, setNewBannerUrl] = useState("");
  const [newGalleryUrl, setNewGalleryUrl] = useState("");
  const content = draft ?? contentQuery.data ?? DEFAULT_SITE_CONTENT;
  const category = content.portfolio.find((item) => item.id === categoryId) ?? content.portfolio[0];

  const saveMutation = useMutation({
    mutationFn: (payload: SiteContent) => apiPut<SiteContent>("/site-content", payload),
    onSuccess: (saved) => { setDraft(saved); queryClient.setQueryData(["site-content"], saved); void queryClient.invalidateQueries({ queryKey: ["site-content"] }); toast.success("Content saved to the live site."); },
    onError: () => toast.error("Could not save content. Please try again."),
  });

  const update = (changes: Partial<SiteContent>) => setDraft((current) => ({ ...(current ?? clone(content)), ...changes }));
  const addVideo = () => {
    if (!newVideoTitle.trim() || !newVideoUrl.trim()) return;
    update({ portfolio: content.portfolio.map((item) => item.id === category.id ? { ...item, videos: [...item.videos, { id: `video-${Date.now()}`, title: newVideoTitle.trim(), url: newVideoUrl.trim() }] } : item) });
    setNewVideoTitle(""); setNewVideoUrl("");
  };
  const removeVideo = (videoId: string) => update({ portfolio: content.portfolio.map((item) => item.id === category.id ? { ...item, videos: item.videos.filter((video) => video.id !== videoId) } : item) });
  const addImage = (src: string, title = "Production still") => {
    if (!src.trim()) return;
    const existing = content.gallery.find((image) => image.src === src.trim());
    update({ gallery: [existing ?? { id: `gallery-${crypto.randomUUID()}`, src: src.trim(), title }, ...content.gallery.filter((image) => image.src !== src.trim())] });
    setNewGalleryUrl("");
  };
  const addBanner = (src: string, alt = "ROAR Ads banner") => {
    if (!src.trim()) return;
    if (content.hero_images.some((image) => image.src === src.trim())) { toast.info("This photo is already a banner."); return; }
    update({ hero_images: [...content.hero_images, { id: `hero-${crypto.randomUUID()}`, src: src.trim(), alt }] });
    setNewBannerUrl("");
  };
  const moveImage = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= content.gallery.length) return;
    const gallery = [...content.gallery];
    [gallery[index], gallery[target]] = [gallery[target], gallery[index]];
    update({ gallery });
  };
  const removeImage = (imageId: string) => update({ gallery: content.gallery.filter((image) => image.id !== imageId) });
  const handleFile = (event: ChangeEvent<HTMLInputElement>, type: "banner" | "gallery") => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const src = typeof reader.result === "string" ? reader.result : "";
      if (type === "banner") addBanner(src, file.name);
      else addImage(src, file.name);
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  return <main className="manage-page" data-testid="content-manager-page"><div className="manage-header"><a href="/" className="back-link" data-testid="content-manager-back-link"><ArrowLeft size={16} /> Back to site</a><div><span className="eyebrow">ROAR ADS / CONTENT STUDIO</span><h1 data-testid="content-manager-heading">Keep the frame current.</h1><p data-testid="content-manager-description">Update banners, portfolio links, gallery stills, and the live copy without touching the site structure.</p></div><Button className="manage-save" onClick={() => saveMutation.mutate(content)} disabled={saveMutation.isPending} data-testid="content-manager-save-button"><Save size={16} />{saveMutation.isPending ? "Saving..." : "Save changes"}</Button></div>
    <div className="manage-grid">
      <Card className="manage-card manage-copy-card"><CardHeader><CardTitle><span className="manage-icon"><Video size={17} /></span>Site copy</CardTitle></CardHeader><CardContent className="manage-form"><label>Hero heading<Input value={content.hero_title} onChange={(event) => update({ hero_title: event.target.value })} data-testid="manage-hero-title-input" /></label><label>Hero sub-heading<Textarea value={content.hero_subtitle} onChange={(event) => update({ hero_subtitle: event.target.value })} data-testid="manage-hero-subtitle-input" /></label><label>Story heading<Input value={content.story_title} onChange={(event) => update({ story_title: event.target.value })} data-testid="manage-story-title-input" /></label><label>Story copy<Textarea value={content.story_body} onChange={(event) => update({ story_body: event.target.value })} data-testid="manage-story-body-input" /></label><div className="manage-form-row"><label>Email<Input value={content.contact_email} onChange={(event) => update({ contact_email: event.target.value })} data-testid="manage-email-input" /></label><label>Phone<Input value={content.contact_phone} onChange={(event) => update({ contact_phone: event.target.value })} data-testid="manage-phone-input" /></label></div><label>Address / cities<Input value={content.contact_address} onChange={(event) => update({ contact_address: event.target.value })} data-testid="manage-address-input" /></label></CardContent></Card>

      <Card className="manage-card"><CardHeader><CardTitle data-testid="manage-banners-heading"><span className="manage-icon"><ImagePlus size={17} /></span>Hero banners</CardTitle></CardHeader><CardContent>
        <p className="manage-help" data-testid="manage-banners-help">Choose a codebase photo, enter a public URL or local /stills/ path, or upload an image. The hero uses the saved order.</p>
        <div className="manage-list">{content.hero_images.map((image, index) => <div className="manage-list-row" key={image.id}><img src={image.src} alt={image.alt} data-testid={`manage-banner-${index + 1}-image`} /><span data-testid={`manage-banner-${index + 1}-label`}>Banner {index + 1}</span><Button variant="ghost" size="icon" onClick={() => update({ hero_images: content.hero_images.filter((item) => item.id !== image.id) })} aria-label={`Remove banner ${index + 1}`} data-testid={`manage-banner-${index + 1}-remove-button`}><Trash2 size={15} /></Button></div>)}</div>
        <CodebasePhotoPicker kind="banner" photos={localPhotosQuery.data ?? []} loading={localPhotosQuery.isFetching} failed={localPhotosQuery.isError} onRefresh={() => { void localPhotosQuery.refetch(); }} onSelect={(photo) => addBanner(photo.src, photo.title)} />
        <div className="manage-inline-add"><Input value={newBannerUrl} onChange={(event) => setNewBannerUrl(event.target.value)} aria-label="Banner URL or local path" placeholder="/stills/photo.jpg or https://…" data-testid="manage-banner-url-input" /><Button variant="outline" onClick={() => addBanner(newBannerUrl)} aria-label="Add banner from URL or path" data-testid="manage-banner-url-add-button"><Plus size={15} /></Button></div>
        <label className="file-input-label" data-testid="manage-banner-upload-label">Upload banner<input type="file" accept="image/*" onChange={(event) => handleFile(event, "banner")} data-testid="manage-banner-upload-input" /></label>
      </CardContent></Card>

      <Card className="manage-card manage-portfolio-card"><CardHeader><CardTitle><span className="manage-icon"><Video size={17} /></span>Portfolio video links</CardTitle></CardHeader><CardContent><div className="manage-category-tabs">{content.portfolio.map((item) => <button key={item.id} className={item.id === category.id ? "is-active" : ""} onClick={() => setCategoryId(item.id)} data-testid={`manage-${item.id}-category-button`}>{item.title}</button>)}</div><p className="manage-help">Paste a YouTube watch or short link. It is displayed in the selected category and opens in the cinema player.</p><div className="manage-video-list">{category.videos.map((video) => <div className="manage-video-row" key={video.id}><div><strong>{video.title}</strong><small>{video.url}</small></div><Button variant="ghost" size="icon" onClick={() => removeVideo(video.id)} aria-label={`Remove ${video.title}`} data-testid={`manage-video-${video.id}-remove-button`}><Trash2 size={15} /></Button></div>)}</div><div className="manage-add-video"><Input value={newVideoTitle} onChange={(event) => setNewVideoTitle(event.target.value)} placeholder="Video title" data-testid="manage-video-title-input" /><Input value={newVideoUrl} onChange={(event) => setNewVideoUrl(event.target.value)} placeholder="https://youtu.be/..." data-testid="manage-video-url-input" /><Button onClick={addVideo} data-testid="manage-video-add-button"><Plus size={15} /> Add link</Button></div></CardContent></Card>

      <Card className="manage-card"><CardHeader><CardTitle data-testid="manage-gallery-heading"><span className="manage-icon"><ImagePlus size={17} /></span>Our Story photos</CardTitle></CardHeader><CardContent>
        <p className="manage-help" data-testid="manage-gallery-help">Only the first three photos appear in Our Story. Move photos up or down to arrange the collage. The remaining photos stay here for future use. Save changes to publish.</p>
        <div className="manage-gallery-list" data-testid="manage-gallery-list">{content.gallery.map((image: GalleryImage, index) => <div className="manage-gallery-row" key={image.id} data-testid={`manage-gallery-${index + 1}-row`}>
          <img src={image.src} alt={image.title} data-testid={`manage-gallery-${index + 1}-image`} />
          <span data-testid={`manage-gallery-${index + 1}-label`}>{image.title}<small className="manage-gallery-placement" data-testid={`manage-gallery-${index + 1}-placement`}>{index < 3 ? `Our Story · ${index === 0 ? "Left" : index === 1 ? "Top right" : "Bottom right"}` : "Saved photo"}</small></span>
          <div className="manage-photo-actions">
            <Button variant="ghost" size="icon" disabled={index === 0} onClick={() => moveImage(index, -1)} aria-label={`Move ${image.title} up`} data-testid={`manage-gallery-${index + 1}-up-button`}><ArrowUp size={15} /></Button>
            <Button variant="ghost" size="icon" disabled={index === content.gallery.length - 1} onClick={() => moveImage(index, 1)} aria-label={`Move ${image.title} down`} data-testid={`manage-gallery-${index + 1}-down-button`}><ArrowDown size={15} /></Button>
            <Button variant="ghost" size="icon" onClick={() => removeImage(image.id)} aria-label={`Remove ${image.title}`} data-testid={`manage-gallery-${image.id}-remove-button`}><Trash2 size={15} /></Button>
          </div>
        </div>)}</div>
        <CodebasePhotoPicker kind="gallery" photos={localPhotosQuery.data ?? []} loading={localPhotosQuery.isFetching} failed={localPhotosQuery.isError} onRefresh={() => { void localPhotosQuery.refetch(); }} onSelect={(photo) => addImage(photo.src, photo.title)} />
        <div className="manage-inline-add"><Input value={newGalleryUrl} onChange={(event) => setNewGalleryUrl(event.target.value)} aria-label="Story photo URL or local path" placeholder="/stills/photo.jpg or https://…" data-testid="manage-gallery-url-input" /><Button variant="outline" onClick={() => addImage(newGalleryUrl)} aria-label="Use photo from URL or path in Our Story" data-testid="manage-gallery-url-add-button"><Plus size={15} /></Button></div>
        <label className="file-input-label" data-testid="manage-gallery-upload-label">Upload story photo<input type="file" accept="image/*" onChange={(event) => handleFile(event, "gallery")} data-testid="manage-gallery-upload-input" /></label>
      </CardContent></Card>
    </div>
    <p className="manage-footnote" data-testid="content-manager-footnote">This editor stores content in the app database. YouTube embeds use privacy-enhanced playback and load only when a visitor opens a film.</p>
  </main>;
}