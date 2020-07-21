import { GraphQLResolveInfo } from "graphql";
import {
  Person as PersonGraphql,
  House as HouseGraphql,
  PersonResolvers,
  Query,
  QueryResolvers,
  QueryPeopleArgs,
  QueryHousesArgs,
} from "../../generated/graphql/types";
import {
  Person as PersonGrpc,
  PersonsResponse,
} from "../../generated/grpcServer/person_pb";
import {
  House as HouseGrpc,
  HousesResponse,
} from "../../generated/grpcServer/house_pb";
import { grpcGraphqlMapper } from "../mappers/mapper";
import { CustomContext } from "../context/customContext";
import { allHouse } from "../../database/fake";
export const personresolver: {
  Person: PersonResolvers;
  Query: QueryResolvers;
} = {
  Query: {
    people: async (
      source: Partial<Query>,
      args: QueryPeopleArgs,
      context: CustomContext,
      info: GraphQLResolveInfo
    ): Promise<PersonGraphql[]> => {
      const allPeople: PersonsResponse = await context.dataSources.personService.getListPerson(
        args.ids
      );
      const allPeopleObj: PersonGrpc[] = allPeople.getPeopleList();
      return grpcGraphqlMapper.peopleFromResponse(allPeopleObj);
    },
  },
  Person: {
    fullname: async (
      source: Partial<PersonGraphql>,
      args: {},
      context: CustomContext,
      info: GraphQLResolveInfo
    ): Promise<string> => {
      return source.firstname + " " + source.lastname;
    },
    houses: async (
      source: Partial<PersonGraphql>,
      args: {},
      context: CustomContext,
      info: GraphQLResolveInfo
    ): Promise<HouseGraphql[]> => {
      if (source.id !== undefined) {
        const personFrpmGrpc = await context.dataSources.personService.getPerson(
          source.id
        );
        const housesOfPersonIds =
          personFrpmGrpc
            .getPerson()
            ?.getHouseidList()
            .map((d) => d.getValue()) ?? [];
        const housesForPerson: HousesResponse = await context.dataSources.houseService.getListHouses(
          housesOfPersonIds
        );
        const housesForPersonMapped = grpcGraphqlMapper.houseFromResponse(
          housesForPerson.getHousesList()
        );
        return housesForPersonMapped;
      }
      return [];
    },
  },
};
export default personresolver;
