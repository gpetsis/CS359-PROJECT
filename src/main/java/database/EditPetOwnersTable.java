/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package database;

import com.google.gson.Gson;
import mainClasses.PetOwner;
import database.DB_Connection;
import java.io.FileNotFoundException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author Mike
 */
public class EditPetOwnersTable {

    public SQLException addPetOwnerFromJSON(String json) throws ClassNotFoundException, FileNotFoundException {
        PetOwner user = jsonToPetOwner(json);
        return addNewPetOwner(user);
    }
    
     public PetOwner jsonToPetOwner(String json){
         Gson gson = new Gson();

        PetOwner user = gson.fromJson(json, PetOwner.class);
        return user;
    }
    
    public String petOwnerToJSON(PetOwner user){
         Gson gson = new Gson();

        String json = gson.toJson(user, PetOwner.class);
        return json;
    }
    
    public void deletePetOwner(String id) throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        String update = "DELETE FROM petowners WHERE owner_id=" + id;
        stmt.executeUpdate(update);
    }
    
    public void updatePetOwner(String username,String personalpage) throws SQLException, ClassNotFoundException{
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        String update="UPDATE petowners SET personalpage='"+personalpage+"' WHERE username = '"+username+"'";
        stmt.executeUpdate(update);
    }

    public int numberOfOwners() {
        try {
            Connection con;
            con = DB_Connection.getConnection();
            String sql = "SELECT COUNT(*) AS count FROM petowners";
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

    public ArrayList<PetOwner> getOwners() throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        ArrayList<PetOwner> owners = new ArrayList<PetOwner>();
        ResultSet rs = null;
        try {
            rs = stmt.executeQuery("SELECT * FROM petowners");

            while (rs.next()) {
                String json = DB_Connection.getResultsToJSON(rs);
                Gson gson = new Gson();
                PetOwner owner = gson.fromJson(json, PetOwner.class);
                owners.add(owner);
            }
            return owners;
        } catch (Exception e) {
            System.err.println("Got an exception! ");
            System.err.println(e.getMessage());
        }
        return null;
    }

    public PetOwner databaseToPetOwners(String username) throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();

        ResultSet rs;
        try {
            rs = stmt.executeQuery("SELECT * FROM petowners WHERE username = '" + username + "'");
            rs.next();
            String json = DB_Connection.getResultsToJSON(rs);
            Gson gson = new Gson();
            PetOwner user = gson.fromJson(json, PetOwner.class);
            return user;
        } catch (Exception e) {
            System.err.println("Got an exception! ");
            System.err.println(e.getMessage());
        }
        return null;
    }

    public PetOwner databaseToPetOwners(String username, String password) throws SQLException, ClassNotFoundException{
         Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();

        ResultSet rs;
        try {
            rs = stmt.executeQuery("SELECT * FROM petowners WHERE username = '" + username + "' AND password='"+password+"'");
            rs.next();
            String json=DB_Connection.getResultsToJSON(rs);
            Gson gson = new Gson();
            PetOwner user = gson.fromJson(json, PetOwner.class);
            return user;
        } catch (Exception e) {
            System.err.println("Got an exception! ");
            System.err.println(e.getMessage());
        }
        return null;
    }
    
    public String databasePetOwnerToJSON(String username, String password) throws SQLException, ClassNotFoundException{
         Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();

        ResultSet rs;
        try {
            rs = stmt.executeQuery("SELECT * FROM petowners WHERE username = '" + username + "' AND password='"+password+"'");
            rs.next();
            String json=DB_Connection.getResultsToJSON(rs);
            return json;
        } catch (Exception e) {
            System.err.println("Got an exception! ");
            System.err.println(e.getMessage());
        }
        return null;
    }

    public SQLException updatePetOwner(PetOwner user) throws ClassNotFoundException, FileNotFoundException {
        try {
            Connection con = DB_Connection.getConnection();

            Statement stmt = con.createStatement();

            String insertQuery = "UPDATE petowners SET "
                    + "password='" + user.getPassword() + "',"
                    + "firstname='" + user.getFirstname() + "',"
                    + "lastname='" + user.getLastname() + "',"
                    + "birthdate='" + user.getBirthdate() + "',"
                    + "gender='" + user.getGender() + "',"
                    + "country='" + user.getCountry() + "',"
                    + "city='" + user.getCity() + "',"
                    + "address='" + user.getAddress() + "',"
                    + "personalpage='" + user.getPersonalpage() + "',"
                    + "job='" + user.getJob() + "',"
                    + "telephone='" + user.getTelephone() + "',"
                    + "lat='" + user.getLat() + "',"
                    + "lon='" + user.getLon() + "'"
                    + " WHERE username='" + user.getUsername() + "'";
            //stmt.execute(table);
            System.out.println(insertQuery);
            stmt.executeUpdate(insertQuery);
            System.out.println("# The pet owner was successfully updated in the database.");

            /* Get the member id from the database and set it to the member */
            stmt.close();

            return null;
        } catch (SQLException ex) {
            System.out.println(ex);
            Logger.getLogger(EditPetKeepersTable.class.getName()).log(Level.SEVERE, null, ex);
            return ex;
        }
    }



     public void createPetOwnersTable() throws SQLException, ClassNotFoundException {

        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();

        String query = "CREATE TABLE petowners "
                + "(owner_id INTEGER not NULL AUTO_INCREMENT, "
                + "    username VARCHAR(30) not null unique,"
                + "    email VARCHAR(50) not null unique,	"
                + "    password VARCHAR(32) not null,"
                + "    firstname VARCHAR(30) not null,"
                + "    lastname VARCHAR(30) not null,"
                + "    birthdate DATE not null,"
                + "    gender  VARCHAR (7) not null,"
                + "    country VARCHAR(30) not null,"
                + "    city VARCHAR(50) not null,"
                + "    address VARCHAR(50) not null,"
                + "    personalpage VARCHAR(200) not null,"
                + "    job VARCHAR(200) not null,"
                + "    telephone VARCHAR(14),"
                  + "    lat DOUBLE,"
                + "    lon DOUBLE,"
                 + " PRIMARY KEY (owner_id)) ON DELETE CASCADE";
        stmt.execute(query);
        stmt.close();
    }
    
    
    /**
     * Establish a database connection and add in the database.
     *
     * @throws ClassNotFoundException
     */
    public SQLException addNewPetOwner(PetOwner user) throws ClassNotFoundException {
        try {
            Connection con = DB_Connection.getConnection();

            Statement stmt = con.createStatement();

            String insertQuery = "INSERT INTO "
                    + " petowners (username,email,password,firstname,lastname,birthdate,gender,country,city,address,personalpage,"
                    + "job,telephone,lat,lon)"
                    + " VALUES ("
                    + "'" + user.getUsername() + "',"
                    + "'" + user.getEmail() + "',"
                    + "'" + user.getPassword() + "',"
                    + "'" + user.getFirstname() + "',"
                    + "'" + user.getLastname() + "',"
                    + "'" + user.getBirthdate() + "',"
                    + "'" + user.getGender() + "',"
                    + "'" + user.getCountry() + "',"
                    + "'" + user.getCity() + "',"
                    + "'" + user.getAddress() + "',"
                    + "'" + user.getPersonalpage() + "',"
                    + "'" + user.getJob() + "',"
                    + "'" + user.getTelephone() + "',"
                    + "'" + user.getLat() + "',"
                    + "'" + user.getLon() + "'"
                    + ")";
            //stmt.execute(table);
            System.out.println(insertQuery);
            stmt.executeUpdate(insertQuery);
            System.out.println("# The pet owner was successfully added in the database.");

            /* Get the member id from the database and set it to the member */
            stmt.close();
            return null;
        } catch (SQLException ex) {
            System.out.println("Error: " + ex);
            Logger.getLogger(EditPetOwnersTable.class.getName()).log(Level.SEVERE, null, ex);
            return ex;
        }
    }

   

}
