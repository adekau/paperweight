export interface IPaperweightOptions {
    /**
     * Debounce on form change (in milliseconds)
     */
    debounceInterval?: number;

    /**
     * Name of the IndexedDB store to use.
     * Default: 'drafts'
     */
    storeName?: string;
}
