import Realm from 'realm';

class Map_Points_Info_SelectedDocuments extends Realm.Object {
  _id!: string;
  _account!: number;
  fileName!: string;
  owner!: number;
  searchText!: string; // Use the Point schema here
  type!: string;
  uri!: string;

  static schema: Realm.ObjectSchema = {
    name: 'map_points_info_selectedDocuments',
    embedded: true,
    properties: {
      _id: 'string?',
      _account: 'int?',
      fileName: 'string?',
      owner: 'int?',
      searchText: 'string?',
      type: 'string?',
      uri: 'string?',
    },
  };
}

export default Map_Points_Info_SelectedDocuments;
