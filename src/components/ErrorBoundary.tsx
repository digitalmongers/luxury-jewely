'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  title?: string;
  description?: string;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      message: error?.message || 'Unexpected rendering interruption.',
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[AtelierErrorBoundary]', error, info.componentStack);
    }
  }

  handleReset = (): void => {
    this.setState({ hasError: false, message: '' });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          role="alert"
          className="w-full p-6 sm:p-8 bg-[#101015] border border-white/[0.12] text-center space-y-3"
        >
          <div className="inline-flex items-center justify-center w-10 h-10 border border-[#D6C7AE]/40 text-[#D6C7AE]">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h3 className="font-display text-2xl font-semibold text-[#F4F4F6]">
            {this.props.title || 'Unable to Render Section'}
          </h3>
          <p className="text-[13px] text-[#A1A1AA] max-w-md mx-auto">
            {this.props.description ||
              'A display module encountered a temporary interruption. You can retry loading it without refreshing the page.'}
          </p>
          <button
            type="button"
            onClick={this.handleReset}
            className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[42px] bg-[#F4F4F6] hover:bg-[#D6C7AE] text-[#08080A] text-[12px] font-semibold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retry Section</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
