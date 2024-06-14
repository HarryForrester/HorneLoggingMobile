import Realm from 'realm';
import Map_Points_Info_SelectedDocuments from './Map_Points_Info_SelectedDocuments';

class Map_Point_Info extends Realm.Object {
  crews!: string[];
  pointName!: string;
  selectedDocuments!: Realm.List<Map_Points_Info_SelectedDocuments>;
  siteHazards!: string[];

  static schema: Realm.ObjectSchema = {
    name: 'map_point_info',
    embedded: true,
    properties: {
      crews: 'string[]',
      pointName: 'string?',
      selectedDocuments: 'map_points_info_selectedDocuments[]',
      siteHazards: 'string[]',
    },
  };
}

export default Map_Point_Info;
