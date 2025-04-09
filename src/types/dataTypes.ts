export interface productBeverageTypes {
    id: string,
    nameProduct : string,
    sugars: number,
    type: string,
    volume: number
}

export interface educationsForFunfactSugar {
    id: string,
    funFact: string
}

export interface educationsForArtikel {
    id: string,
    kalimatEdukasi : string,
    linkEdukasi : string,
    sumberReferensi : string
}

export interface educationsForVideo {
    id: string,
    linkVideo: string,
    sumber: string,
    sumberReferensiVideo: string
}