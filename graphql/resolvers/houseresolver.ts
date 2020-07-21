import {
  HouseResolvers,
  QueryResolvers,
  Query,
  QueryHousesArgs,
} from "../../generated/graphql/types";
import {
  House as HouseGraphQL,
  Person as PersonGraphql,
} from "../../generated/graphql/types";
import { GraphQLResolveInfo } from "graphql";
import { Person as PersonGrpc } from "../../generated/grpcServer/person_pb";
import { grpcGraphqlMapper } from "../mappers/mapper";
import { HousesResponse } from "../../generated/grpcServer/house_pb";
import { CustomContext } from "../context/customContext";
export const houseresolver: {
  House: HouseResolvers;
  Query: QueryResolvers;
} = {
  Query: {
    houses: async (
      source: Partial<Query>,
      args: QueryHousesArgs,
      context: CustomContext,
      info: GraphQLResolveInfo
    ): Promise<HouseGraphQL[]> => {
      const allHouses: HousesResponse = await context.dataSources.houseService.getListHouses(
        args.ids
      );
      return grpcGraphqlMapper.houseFromResponse(allHouses.getHousesList());
    },
  },
  House: {
    Owner: async (
      source: Partial<HouseGraphQL>,
      args: {},
      context: CustomContext,
      info: GraphQLResolveInfo
    ): Promise<PersonGraphql> => {
      const person = await context.dataSources.personService.getPerson(
        source.Owner?.id ?? -1
      );
      const personGrpc = person.getPerson();
      if (personGrpc !== undefined) {
        return grpcGraphqlMapper.peopleFromResponse([personGrpc])[0];
      } else {
        return grpcGraphqlMapper.person(undefined);
      }
    },
  },
};

export default houseresolver;
