/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package database;

import mainClasses.Pet;
import com.google.gson.Gson;
import database.DB_Connection;
import java.io.FileNotFoundException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.NoSuchElementException;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author Mike
 */
public class EditPetsTable {

    public Exception addPetFromJSON(String json) throws ClassNotFoundException {
        Pet bt = jsonToPet(json);
        return createNewPet(bt);
    }

    public Pet jsonToPet(String json) {
        Gson gson = new Gson();
        Pet btest = gson.fromJson(json, Pet.class);
        return btest;
    }

    public String petToJSON(Pet bt) {
        Gson gson = new Gson();

        String json = gson.toJson(bt, Pet.class);
        return json;
    }

    public ArrayList<Pet> databaseToPets() throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        ArrayList<Pet> pets = new ArrayList<Pet>();
        ResultSet rs;
        try {
            rs = stmt.executeQuery("SELECT * FROM pets");
            while (rs.next()) {
                String json = DB_Connection.getResultsToJSON(rs);
                Gson gson = new Gson();
                Pet pet = gson.fromJson(json, Pet.class);
                pets.add(pet);
            }
            return pets;

        } catch (Exception e) {
            System.err.println("Got an exception! ");
            System.err.println(e.getMessage());
        }
        return null;
    }

    public int numberOfCats() {
        try {
            Connection con;
            con = DB_Connection.getConnection();
            String sql = "SELECT COUNT(*) AS count FROM pets WHERE type = 'cat'";
            PreparedStatement preparedStatement = con.prepareStatement(sql);
            ResultSet resultSet = preparedStatement.executeQuery();
            if (resultSet.next()) {
                return resultSet.getInt("count");
            }
        } catch (SQLException | ClassNotFoundException ex) {
            Logger.getLogger(EditPetsTable.class.getName()).log(Level.SEVERE, null, ex);
        }
        return -1;
    }

    public int numberOfDogs() {
        try {
            Connection con;
            con = DB_Connection.getConnection();
            String sql = "SELECT COUNT(*) AS count FROM pets WHERE type = 'dog'";
            PreparedStatement preparedStatement = con.prepareStatement(sql);
            ResultSet resultSet = preparedStatement.executeQuery();
            if (resultSet.next()) {
                return resultSet.getInt("count");
            }
        } catch (SQLException | ClassNotFoundException ex) {
            Logger.getLogger(EditPetsTable.class.getName()).log(Level.SEVERE, null, ex);
        }
        return -1;
    }

    public ArrayList<Pet> databaseToPets(String type, String breed, String fromWeight, String toWeight) throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        ArrayList<Pet> pets = new ArrayList<Pet>();
        ResultSet rs;
        try {
            rs = stmt.executeQuery("SELECT * FROM pets WHERE type='" + type + "' AND breed='" + breed + "' AND weight >= " + fromWeight + " AND weight <= " + toWeight);
            while (rs.next()) {
                String json = DB_Connection.getResultsToJSON(rs);
                Gson gson = new Gson();
                Pet pet = gson.fromJson(json, Pet.class);
                pets.add(pet);
            }
            return pets;

        } catch (Exception e) {
            System.err.println("Got an exception! ");
            System.err.println(e.getMessage());
        }
        return null;
    }

    public ArrayList<Pet> databaseToPets(String type) throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        ArrayList<Pet> pets = new ArrayList<Pet>();
        ResultSet rs;
        try {
            rs = stmt.executeQuery("SELECT * FROM pets WHERE type='" + type + "'");
            while (rs.next()) {
                String json = DB_Connection.getResultsToJSON(rs);
                Gson gson = new Gson();
                Pet pet = gson.fromJson(json, Pet.class);
                pets.add(pet);
            }
            return pets;

        } catch (Exception e) {
            System.err.println("Got an exception! ");
            System.err.println(e.getMessage());
        }
        return null;
    }

    public Pet petOfOwner(String id) throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        Pet pet = new Pet();
        ResultSet rs;
        try {
            rs = stmt.executeQuery("SELECT * FROM pets WHERE owner_id= '" + id + "'");
           
            while (rs.next()) {
                String json = DB_Connection.getResultsToJSON(rs);
                Gson gson = new Gson();
                pet = gson.fromJson(json, Pet.class);
               
            }
            return pet;
        } catch (Exception e) {
            System.err.println("Got an exception! ");
            System.err.println(e.getMessage());
        }
        return null;
    }

    public ArrayList<Pet> databaseToPets(String type, String fromWeight, String toWeight) throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        ArrayList<Pet> pets = new ArrayList<Pet>();
        ResultSet rs;
        try {
            rs = stmt.executeQuery("SELECT * FROM pets WHERE type= '" + type + "' AND weight >= " + fromWeight + " AND weight <= " + toWeight);
           
            while (rs.next()) {
                String json = DB_Connection.getResultsToJSON(rs);
                Gson gson = new Gson();
                Pet pet = gson.fromJson(json, Pet.class);
                pets.add(pet);
            }
            return pets;
        } catch (Exception e) {
            System.err.println("Got an exception! ");
            System.err.println(e.getMessage());
        }
        return null;
    }

    public void updatePet(String id, String weight) throws ClassNotFoundException, FileNotFoundException, NoSuchElementException, SQLException {
        Connection con;
        try {
            con = DB_Connection.getConnection();
            Statement stmt = con.createStatement();

            String update = "UPDATE pets SET weight=" + weight + " WHERE pet_id='" + id + "'";

            System.out.println(update);
            int number = stmt.executeUpdate(update);
            System.out.println("# The pet was successfully updated in the database." + number);

            stmt.close();
            con.close();

            if (number == 0) {
                throw new NoSuchElementException("Pet with id " + id + " not found!");
            } else {
                return;
            }
        } catch (Exception ex) {
            System.out.println("Error: " + ex);
            throw ex;
        }

    }

    public void deletePet(String id) throws SQLException, ClassNotFoundException, FileNotFoundException {
        try {
            Connection con = DB_Connection.getConnection();
            Statement stmt = con.createStatement();

            String deleteQuery = "DELETE FROM pets WHERE pet_id='" + id + "'";

            System.out.println(deleteQuery);
            int number = stmt.executeUpdate(deleteQuery);
            System.out.println("# The pet was successfully deleted from the database." + number);

            stmt.close();
            con.close();

            if (number == 0) {
                throw new NoSuchElementException("Pet with id " + id + " not found!");
            } else {
                return;
            }
        } catch (Exception ex) {
            System.out.println("Error: " + ex);
            throw ex;
        }
    }

    public void createPetsTable() throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        String sql = "CREATE TABLE pets "
                + "(pet_id VARCHAR(10) not NULL unique, "
                + "owner_id INTEGER not null,"
                + "name VARCHAR(30) not null,"
                + "type VARCHAR(3)  not null, "
                + "breed VARCHAR(30)  not null, "
                + "gender VARCHAR(7)  not null, "
                + "birthyear INTEGER not null , "
                + "weight DOUBLE not null , "
                + "description VARCHAR (500), "
                + "photo VARCHAR (300), "
                + "FOREIGN KEY (owner_id) REFERENCES petowners(owner_id), "
                + "PRIMARY KEY (pet_id ))";
        stmt.execute(sql);
        stmt.close();
        con.close();

    }

    /**
     * Establish a database connection and add in the database.
     *
     * @throws ClassNotFoundException
     */
    public Exception createNewPet(Pet bt) throws ClassNotFoundException {
        try {
            Connection con = DB_Connection.getConnection();

            Statement stmt = con.createStatement();

            String insertQuery = "INSERT INTO "
                    + " pets (pet_id,owner_id,name,type,breed,gender,birthyear,weight,description,photo) "
                    + " VALUES ("
                    + "'" + bt.getPet_id() + "',"
                    + "'" + bt.getOwner_id() + "',"
                    + "'" + bt.getName() + "',"
                    + "'" + bt.getType()+ "',"
                    + "'" + bt.getBreed()+ "',"
                    + "'" + bt.getGender()+ "',"
                    + "'" + bt.getBirthyear()+ "',"
                    + "'" + bt.getWeight() + "',"
                    + "'" + bt.getDescription() + "',"
                    + "'" + bt.getPhoto() + "'"
                    + ")";
            //stmt.execute(table);
            System.out.println(insertQuery);
            stmt.executeUpdate(insertQuery);
            System.out.println("# The pet was successfully added in the database.");

            /* Get the member id from the database and set it to the member */
            stmt.close();
            return null;
        } catch (Exception ex) {
            System.out.println(ex);
            return ex;
        }
    }
}
