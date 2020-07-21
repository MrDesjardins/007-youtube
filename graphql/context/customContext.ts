import { DataLoaders } from "./dataloaders/dataloaders";
import { GraphQLCustomDataSources } from "../datesources/graphqlCustomDataSources";

export interface CustomContext {
  loaders: DataLoaders;
  dataSources: GraphQLCustomDataSources
}
