package rest;

import com.google.gson.Gson;
import database.EditPetsTable;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.NoSuchElementException;
import mainClasses.Pet;
import spark.Route;

import spark.Request;
import spark.Response;
import static spark.Spark.get;
import static spark.Spark.post;
import static spark.Spark.put;
import static spark.Spark.delete;

public class restImplementation {

    public static void main(String[] args) {
        GetHandler getHandler = new GetHandler();
        PostHandler postHandler = new PostHandler();
        PutHandler putHandler = new PutHandler();
        DeleteHandler deleteHandler = new DeleteHandler();

        get("/pets/:type/:breed", getHandler);
        post("/pet", postHandler);
        put("/petWeight/:pet_id/:weight", putHandler);
        delete("/petDeletion/:pet_id", deleteHandler);

    }
}

class GetHandler implements Route {

    @Override
    public Object handle(Request request, Response response) throws Exception {
        String type = request.params(":type");
        String breed = request.params(":breed");

        String fromWeight = request.queryParams("fromWeight");
        String toWeight = request.queryParams("toWeight");

        if (fromWeight == null) {
            fromWeight = "-1";
        }

        if (toWeight == null) {
            toWeight = "9999";
        }

        EditPetsTable editPets = new EditPetsTable();
        ArrayList<Pet> pets = new ArrayList<Pet>();

        if (breed.equals("all")) {
            pets = editPets.databaseToPets(type, fromWeight, toWeight);
        } else {
            pets = editPets.databaseToPets(type, breed, fromWeight, toWeight);
        }

        if (pets.size() == 0) {
            response.status(404);
        } else {
            response.status(200);
        }

        return new Gson().toJson(new Gson().toJsonTree(pets));
    }

}

class PostHandler implements Route {

    @Override
    public Object handle(Request request, Response response) throws Exception {
        try {
            EditPetsTable editPets = new EditPetsTable();
            Exception addPetFromJSON = editPets.addPetFromJSON(request.body());
            if (addPetFromJSON != null) {
                response.status(500);
            } else {
                response.status(200);
            }
        } catch (Exception ex) {
            response.status(500);
            System.out.println("Error: " + ex);
        }
        return request.body();
    }

}

class PutHandler implements Route {

    @Override
    public Object handle(Request request, Response response) throws Exception {

        String pet_id = request.params(":pet_id");
        String weight = request.params(":weight");

        try {
            EditPetsTable editPets = new EditPetsTable();
            editPets.updatePet(pet_id, weight);

            response.status(200);
        } catch (SQLException ex) {
            response.status(500);
            System.out.println("Error: " + ex);
        } catch (NoSuchElementException ex) {
            response.status(404);
            System.out.println("Not found: " + ex);
        }

        return request.params(":pet_id") + request.params(":weight");
    }

}

class DeleteHandler implements Route {

    @Override
    public Object handle(Request request, Response response) throws Exception {
        String pet_id = request.params(":pet_id");

        try {
            EditPetsTable editPets = new EditPetsTable();
            editPets.deletePet(pet_id);

            response.status(200);
        } catch (SQLException ex) {
            response.status(500);
            System.out.println("Error: " + ex);
        } catch (NoSuchElementException ex) {
            response.status(404);
            System.out.println("Not found: " + ex);
        }

        return request.params(":pet_id") + request.params(":weight");
    }

}
