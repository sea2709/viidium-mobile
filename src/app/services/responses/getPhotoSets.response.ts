import {PhotoSet} from '../../models/photoset.model';

export class GetPhotoSetsResponse {
    public photoSets: PhotoSet[];
    public total: number;
}