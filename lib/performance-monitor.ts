// Performance monitoring utilities for the markdown editor

interface PerformanceMetrics {
  typingLatency: number[];
  parseTime: number[];
  memoryUsage: number[];
  documentSize: number;
  timestamp: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    typingLatency: [],
    parseTime: [],
    memoryUsage: [],
    documentSize: 0,
    timestamp: Date.now(),
  };

  private maxSamples = 100;
  private enabled = false;

  // Enable/disable monitoring
  enable(): void {
    this.enabled = true;
    console.log('📊 Performance monitoring enabled');
  }

  disable(): void {
    this.enabled = false;
    console.log('📊 Performance monitoring disabled');
  }

  // Record typing latency
  recordTypingLatency(latency: number): void {
    if (!this.enabled) return;

    this.metrics.typingLatency.push(latency);
    if (this.metrics.typingLatency.length > this.maxSamples) {
      this.metrics.typingLatency.shift();
    }

    // Warn if latency is high
    if (latency > 50) {
      console.warn(`⚠️ High typing latency: ${latency.toFixed(2)}ms`);
    }
  }

  // Record parse time
  recordParseTime(time: number): void {
    if (!this.enabled) return;

    this.metrics.parseTime.push(time);
    if (this.metrics.parseTime.length > this.maxSamples) {
      this.metrics.parseTime.shift();
    }

    // Warn if parse time is high
    if (time > 1000) {
      console.warn(`⚠️ Slow parse time: ${time.toFixed(2)}ms`);
    }
  }

  // Record memory usage
  recordMemoryUsage(): void {
    if (!this.enabled) return;
    if (typeof window === 'undefined') return;

    // @ts-ignore - performance.memory is non-standard
    if (performance.memory) {
      // @ts-ignore
      const usage = performance.memory.usedJSHeapSize / 1024 / 1024; // MB
      this.metrics.memoryUsage.push(usage);
      
      if (this.metrics.memoryUsage.length > this.maxSamples) {
        this.metrics.memoryUsage.shift();
      }

      // Warn if memory usage is high
      if (usage > 500) {
        console.warn(`⚠️ High memory usage: ${usage.toFixed(2)}MB`);
      }
    }
  }

  // Update document size
  updateDocumentSize(size: number): void {
    if (!this.enabled) return;
    this.metrics.documentSize = size;
  }

  // Calculate average
  private average(arr: number[]): number {
    if (arr.length === 0) return 0;
    return arr.reduce((a, b) => a + b, 0) / arr.length;
  }

  // Calculate percentile
  private percentile(arr: number[], p: number): number {
    if (arr.length === 0) return 0;
    const sorted = [...arr].sort((a, b) => a - b);
    const index = Math.ceil((p / 100) * sorted.length) - 1;
    return sorted[index];
  }

  // Get performance report
  getReport(): {
    typingLatency: {
      avg: number;
      p50: number;
      p95: number;
      p99: number;
      max: number;
    };
    parseTime: {
      avg: number;
      p50: number;
      p95: number;
      max: number;
    };
    memory: {
      current: number;
      avg: number;
      max: number;
    };
    documentSize: number;
    samples: number;
  } {
    const { typingLatency, parseTime, memoryUsage, documentSize } = this.metrics;

    return {
      typingLatency: {
        avg: this.average(typingLatency),
        p50: this.percentile(typingLatency, 50),
        p95: this.percentile(typingLatency, 95),
        p99: this.percentile(typingLatency, 99),
        max: Math.max(...typingLatency, 0),
      },
      parseTime: {
        avg: this.average(parseTime),
        p50: this.percentile(parseTime, 50),
        p95: this.percentile(parseTime, 95),
        max: Math.max(...parseTime, 0),
      },
      memory: {
        current: memoryUsage[memoryUsage.length - 1] || 0,
        avg: this.average(memoryUsage),
        max: Math.max(...memoryUsage, 0),
      },
      documentSize,
      samples: typingLatency.length,
    };
  }

  // Print report to console
  printReport(): void {
    const report = this.getReport();

    console.log('\n📊 Performance Report\n');
    console.log('Document Size:', (report.documentSize / 1024).toFixed(2), 'KB');
    console.log('Samples:', report.samples);
    console.log('\n⌨️ Typing Latency:');
    console.log('  Average:', report.typingLatency.avg.toFixed(2), 'ms');
    console.log('  Median (p50):', report.typingLatency.p50.toFixed(2), 'ms');
    console.log('  p95:', report.typingLatency.p95.toFixed(2), 'ms');
    console.log('  p99:', report.typingLatency.p99.toFixed(2), 'ms');
    console.log('  Max:', report.typingLatency.max.toFixed(2), 'ms');
    console.log('\n🔄 Parse Time:');
    console.log('  Average:', report.parseTime.avg.toFixed(2), 'ms');
    console.log('  Median (p50):', report.parseTime.p50.toFixed(2), 'ms');
    console.log('  p95:', report.parseTime.p95.toFixed(2), 'ms');
    console.log('  Max:', report.parseTime.max.toFixed(2), 'ms');
    console.log('\n💾 Memory Usage:');
    console.log('  Current:', report.memory.current.toFixed(2), 'MB');
    console.log('  Average:', report.memory.avg.toFixed(2), 'MB');
    console.log('  Max:', report.memory.max.toFixed(2), 'MB');
    console.log('\n');

    // Performance assessment
    const avgLatency = report.typingLatency.avg;
    const p95Latency = report.typingLatency.p95;

    if (avgLatency < 16 && p95Latency < 50) {
      console.log('✅ Excellent performance!');
    } else if (avgLatency < 50 && p95Latency < 100) {
      console.log('✅ Good performance');
    } else if (avgLatency < 100) {
      console.log('⚠️ Acceptable performance, but could be improved');
    } else {
      console.log('❌ Poor performance, optimization needed');
    }
  }

  // Reset metrics
  reset(): void {
    this.metrics = {
      typingLatency: [],
      parseTime: [],
      memoryUsage: [],
      documentSize: 0,
      timestamp: Date.now(),
    };
    console.log('📊 Performance metrics reset');
  }

  // Export metrics as JSON
  exportMetrics(): string {
    return JSON.stringify(this.metrics, null, 2);
  }
}

// Create singleton instance
const performanceMonitor = new PerformanceMonitor();

// Export utilities
export const enablePerformanceMonitoring = () => performanceMonitor.enable();
export const disablePerformanceMonitoring = () => performanceMonitor.disable();
export const recordTypingLatency = (latency: number) => performanceMonitor.recordTypingLatency(latency);
export const recordParseTime = (time: number) => performanceMonitor.recordParseTime(time);
export const recordMemoryUsage = () => performanceMonitor.recordMemoryUsage();
export const updateDocumentSize = (size: number) => performanceMonitor.updateDocumentSize(size);
export const getPerformanceReport = () => performanceMonitor.getReport();
export const printPerformanceReport = () => performanceMonitor.printReport();
export const resetPerformanceMetrics = () => performanceMonitor.reset();
export const exportPerformanceMetrics = () => performanceMonitor.exportMetrics();

// Convenience function to measure typing latency
export const measureTypingLatency = (callback: () => void): void => {
  const start = performance.now();
  callback();
  const end = performance.now();
  recordTypingLatency(end - start);
};

// Convenience function to measure parse time
export const measureParseTime = async (callback: () => Promise<void>): Promise<void> => {
  const start = performance.now();
  await callback();
  const end = performance.now();
  recordParseTime(end - start);
};

// Auto-monitor memory usage every 5 seconds
let memoryMonitorInterval: NodeJS.Timeout | null = null;

export const startMemoryMonitoring = (intervalMs: number = 5000): void => {
  if (memoryMonitorInterval) return;
  
  memoryMonitorInterval = setInterval(() => {
    recordMemoryUsage();
  }, intervalMs);
  
  console.log('📊 Memory monitoring started');
};

export const stopMemoryMonitoring = (): void => {
  if (memoryMonitorInterval) {
    clearInterval(memoryMonitorInterval);
    memoryMonitorInterval = null;
    console.log('📊 Memory monitoring stopped');
  }
};

// Browser console helpers
if (typeof window !== 'undefined') {
  // @ts-ignore
  window.editorPerformance = {
    enable: enablePerformanceMonitoring,
    disable: disablePerformanceMonitoring,
    report: printPerformanceReport,
    reset: resetPerformanceMetrics,
    export: exportPerformanceMetrics,
    startMemoryMonitoring,
    stopMemoryMonitoring,
  };

  console.log('💡 Performance monitoring available via window.editorPerformance');
  console.log('   - editorPerformance.enable()');
  console.log('   - editorPerformance.report()');
  console.log('   - editorPerformance.reset()');
}
