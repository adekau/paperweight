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

    /**
     * Version of the db to use. Defaults to 1 assuming `storeName` is also defaulted.
     * If storeName is modified then this needs to change as well (to something unused before).
     * @note must be > 0
     */
    dbVersion?: number;
}
