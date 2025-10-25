'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
  Download,
  FileText,
  FileImage,
  Settings,
  Eye,
  Palette,
  Clock,
  List,
  Droplets,
} from 'lucide-react';
import { exportToHTML, exportToPDF, ExportOptions, PDFExportOptions } from '@/lib/export';

interface ExportDialogProps {
  content: string;
  title: string;
  children: React.ReactNode;
}

export function ExportDialog({ content, title, children }: ExportDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState<'html' | 'pdf'>('html');
  
  // HTML Export Options
  const [htmlOptions, setHtmlOptions] = useState<ExportOptions>({
    filename: title || 'document',
    includeMetadata: true,
    includeTimestamp: true,
    includeTableOfContents: true,
    customStyles: '',
  });

  // PDF Export Options
  const [pdfOptions, setPdfOptions] = useState<PDFExportOptions>({
    filename: title || 'document',
    includeMetadata: true,
    includeTimestamp: true,
    includeTableOfContents: true,
    pageSize: 'A4',
    orientation: 'portrait',
    margin: 20,
    fontSize: 12,
    fontFamily: 'Georgia',
    includeHeader: true,
    includeFooter: true,
    watermark: '',
  });

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      // Allow UI to update before starting export
      await new Promise(resolve => setTimeout(resolve, 50));
      
      if (exportType === 'html') {
        await exportToHTML(content, htmlOptions);
      } else {
        // PDF export can take 10-30 seconds for large documents
        console.log('Starting PDF export...');
        await exportToPDF(content, pdfOptions);
        console.log('PDF export complete!');
      }
      
      // Keep dialog open briefly to show success
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Export error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Export failed. Please try again.';
      alert(errorMessage);
    } finally {
      setIsExporting(false);
      setIsOpen(false);
    }
  };

  const ExportOptionsForm = () => {
    if (exportType === 'html') {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="html-filename">Filename</Label>
              <Input
                id="html-filename"
                value={htmlOptions.filename}
                onChange={(e) => setHtmlOptions({ ...htmlOptions, filename: e.target.value })}
                placeholder="document"
              />
            </div>
            <div className="space-y-2">
              <Label>Include Options</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="html-metadata"
                    checked={htmlOptions.includeMetadata}
                    onCheckedChange={(checked) => setHtmlOptions({ ...htmlOptions, includeMetadata: checked })}
                  />
                  <Label htmlFor="html-metadata" className="text-sm">Document Header</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="html-timestamp"
                    checked={htmlOptions.includeTimestamp}
                    onCheckedChange={(checked) => setHtmlOptions({ ...htmlOptions, includeTimestamp: checked })}
                  />
                  <Label htmlFor="html-timestamp" className="text-sm">Timestamp</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="html-toc"
                    checked={htmlOptions.includeTableOfContents}
                    onCheckedChange={(checked) => setHtmlOptions({ ...htmlOptions, includeTableOfContents: checked })}
                  />
                  <Label htmlFor="html-toc" className="text-sm">Table of Contents</Label>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="html-styles">Custom CSS (Optional)</Label>
            <Textarea
              id="html-styles"
              value={htmlOptions.customStyles}
              onChange={(e) => setHtmlOptions({ ...htmlOptions, customStyles: e.target.value })}
              placeholder="/* Add custom CSS styles here */"
              rows={4}
              className="font-mono text-sm"
            />
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="pdf-filename">Filename</Label>
            <Input
              id="pdf-filename"
              value={pdfOptions.filename}
              onChange={(e) => setPdfOptions({ ...pdfOptions, filename: e.target.value })}
              placeholder="document"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pdf-page-size">Page Size</Label>
            <Select
              value={pdfOptions.pageSize}
              onValueChange={(value: 'A4' | 'A3' | 'Letter') => setPdfOptions({ ...pdfOptions, pageSize: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A4">A4</SelectItem>
                <SelectItem value="A3">A3</SelectItem>
                <SelectItem value="Letter">Letter</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="pdf-orientation">Orientation</Label>
            <Select
              value={pdfOptions.orientation}
              onValueChange={(value: 'portrait' | 'landscape') => setPdfOptions({ ...pdfOptions, orientation: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="portrait">Portrait</SelectItem>
                <SelectItem value="landscape">Landscape</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="pdf-margin">Margin (mm)</Label>
            <Input
              id="pdf-margin"
              type="number"
              value={pdfOptions.margin}
              onChange={(e) => setPdfOptions({ ...pdfOptions, margin: parseInt(e.target.value) || 20 })}
              min="10"
              max="50"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="pdf-font-size">Font Size (pt)</Label>
            <Input
              id="pdf-font-size"
              type="number"
              value={pdfOptions.fontSize}
              onChange={(e) => setPdfOptions({ ...pdfOptions, fontSize: parseInt(e.target.value) || 12 })}
              min="8"
              max="24"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pdf-font-family">Font Family</Label>
            <Select
              value={pdfOptions.fontFamily}
              onValueChange={(value) => setPdfOptions({ ...pdfOptions, fontFamily: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Georgia">Georgia (Serif)</SelectItem>
                <SelectItem value="Helvetica">Helvetica (Sans-serif)</SelectItem>
                <SelectItem value="Times">Times (Serif)</SelectItem>
                <SelectItem value="Courier">Courier (Monospace)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <Label>Include Options</Label>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center space-x-2">
              <Switch
                id="pdf-metadata"
                checked={pdfOptions.includeMetadata}
                onCheckedChange={(checked) => setPdfOptions({ ...pdfOptions, includeMetadata: checked })}
              />
              <Label htmlFor="pdf-metadata" className="text-sm">Document Header</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="pdf-timestamp"
                checked={pdfOptions.includeTimestamp}
                onCheckedChange={(checked) => setPdfOptions({ ...pdfOptions, includeTimestamp: checked })}
              />
              <Label htmlFor="pdf-timestamp" className="text-sm">Timestamp</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="pdf-toc"
                checked={pdfOptions.includeTableOfContents}
                onCheckedChange={(checked) => setPdfOptions({ ...pdfOptions, includeTableOfContents: checked })}
              />
              <Label htmlFor="pdf-toc" className="text-sm">Table of Contents</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="pdf-header"
                checked={pdfOptions.includeHeader}
                onCheckedChange={(checked) => setPdfOptions({ ...pdfOptions, includeHeader: checked })}
              />
              <Label htmlFor="pdf-header" className="text-sm">Page Header</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="pdf-footer"
                checked={pdfOptions.includeFooter}
                onCheckedChange={(checked) => setPdfOptions({ ...pdfOptions, includeFooter: checked })}
              />
              <Label htmlFor="pdf-footer" className="text-sm">Page Footer</Label>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="pdf-watermark">Watermark Text (Optional)</Label>
          <Input
            id="pdf-watermark"
            value={pdfOptions.watermark}
            onChange={(e) => setPdfOptions({ ...pdfOptions, watermark: e.target.value })}
            placeholder="DRAFT, CONFIDENTIAL, etc."
          />
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Download className="h-5 w-5" />
            <span>Export Document</span>
          </DialogTitle>
          <DialogDescription>
            Choose your export format and customize the output options.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Export Type Selection */}
          <div className="space-y-2">
            <Label>Export Format</Label>
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant={exportType === 'html' ? 'default' : 'outline'}
                onClick={() => setExportType('html')}
                className="h-16 flex flex-col items-center space-y-2"
              >
                <FileText className="h-6 w-6" />
                <span>HTML</span>
                <span className="text-xs opacity-70">Enhanced Web Page</span>
              </Button>
              <Button
                variant={exportType === 'pdf' ? 'default' : 'outline'}
                onClick={() => setExportType('pdf')}
                className="h-16 flex flex-col items-center space-y-2"
              >
                <FileImage className="h-6 w-6" />
                <span>PDF</span>
                <span className="text-xs opacity-70">Print-Ready Document</span>
              </Button>
            </div>
          </div>

          <Separator />

          {/* Export Options */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <Label className="text-base font-medium">Export Options</Label>
            </div>
            <ExportOptionsForm />
          </div>

          <Separator />

          {/* Export Button */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleExport} 
              disabled={isExporting}
              className="min-w-[120px]"
            >
              {isExporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Export {exportType.toUpperCase()}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
