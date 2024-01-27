/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package database;

import com.google.gson.Gson;
import database.DB_Connection;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.logging.Level;
import java.util.logging.Logger;
import mainClasses.Review;

/**
 *
 * @author micha
 */
public class EditReviewsTable {

    
     public void addReviewFromJSON(String json) throws ClassNotFoundException{
         Review msg=jsonToReview(json);
         createNewReview(msg);
    }
    
      public Review jsonToReview(String json) {
        Gson gson = new Gson();
        Review msg = gson.fromJson(json, Review.class);
        return msg;
    }
     
    public String reviewToJSON(Review msg) {
        Gson gson = new Gson();

        String json = gson.toJson(msg, Review.class);
        return json;
    }

   
    
    
     public ArrayList<Review> databaseTokeeperReviews(String keeper_id) throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        ArrayList<Review> revs=new ArrayList<Review>();
        ResultSet rs;
        try {
            rs = stmt.executeQuery("SELECT * FROM reviews where keeper_id='"+keeper_id+"'");
            while (rs.next()) {
                String json = DB_Connection.getResultsToJSON(rs);
                Gson gson = new Gson();
                Review rev = gson.fromJson(json, Review.class);
                revs.add(rev);
            }
            return revs;

        } catch (Exception e) {
            System.err.println("Got an exception! ");
            System.err.println(e.getMessage());
        }
        return null;
    }


    public void createReviewTable() throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        String sql = "CREATE TABLE reviews "
                + "(review_id INTEGER not NULL AUTO_INCREMENT, "
                + "owner_id INTEGER not null,"
                + "keeper_id INTEGER not null,"
                + "reviewText VARCHAR(2000) not null,"
                + "reviewScore INTEGER not null,"
                + "FOREIGN KEY (owner_id) REFERENCES petowners(owner_id), "
                + "FOREIGN KEY (keeper_id) REFERENCES petkeepers(keeper_id), "
                + "PRIMARY KEY ( review_id ))";
        stmt.execute(sql);
        stmt.close();
        con.close();

    }

    /**
     * Establish a database connection and add in the database.
     *
     * @throws ClassNotFoundException
     */
    public void createNewReview(Review rev) throws ClassNotFoundException {
        try {
            Connection con = DB_Connection.getConnection();

            Statement stmt = con.createStatement();

            String insertQuery = "INSERT INTO "
                    + " reviews (owner_id, keeper_id,reviewText,reviewScore) "
                    + " VALUES ("
                    + "'" + rev.getOwner_id()+ "',"
                    + "'" + rev.getKeeper_id()+ "',"
                    + "'" + rev.getReviewText() + "',"
                    + "'" + rev.getReviewScore() + "'"
                    + ")";
            System.out.println(insertQuery);
            stmt.executeUpdate(insertQuery);
            System.out.println("# The review was successfully added in the database.");

            /* Get the member id from the database and set it to the member */
            stmt.close();

        } catch (SQLException ex) {
            Logger.getLogger(EditPetsTable.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    public void updateReviewText(Review r, String review_id) throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        String updateQuery = "UPDATE reviews SET reviewText='" + r.getReviewText() + "' WHERE review_id='" + review_id + "'";
        System.out.println(updateQuery);
        stmt.executeUpdate(updateQuery);
        stmt.close();
        con.close();
    }

    public void deleteReviewOwner(String owner_id) {
        try {
            Connection con = DB_Connection.getConnection();
            Statement stmt = con.createStatement();
            String update = "DELETE FROM reviews WHERE owner_id=" + owner_id;
            stmt.executeUpdate(update);
        } catch (SQLException | ClassNotFoundException ex) {
            Logger.getLogger(EditReviewsTable.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    public void deleteReviewKeeper(String keeper_id) throws SQLException, ClassNotFoundException {
        try {
            Connection con = DB_Connection.getConnection();
            Statement stmt = con.createStatement();
            String update = "DELETE FROM reviews WHERE keeper_id=" + keeper_id;
            stmt.executeUpdate(update);
        } catch (SQLException | ClassNotFoundException ex) {
            Logger.getLogger(EditReviewsTable.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    public void updateReviewScore(Review r, String review_id) throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        String updateQuery = "UPDATE reviews SET reviewScore='" + r.getReviewScore() + "' WHERE review_id='" + review_id + "'";
        System.out.println(updateQuery);
        stmt.executeUpdate(updateQuery);
        stmt.close();
        con.close();
    }

    public String getReviewId(Review r) throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();

        ResultSet rs;
        try {
            rs = stmt.executeQuery("SELECT review_id FROM reviews WHERE keeper_id= '" + r.getKeeper_id() + "' AND owner_id= '" + r.getOwner_id() + "'");
            rs.next();
            String json = DB_Connection.getResultsToJSON(rs);
            int colonIndex = json.indexOf(':');
            String valuePart = "";
            if (colonIndex != -1) {
                valuePart = json.substring(colonIndex + 1).trim();
                valuePart = valuePart.replaceAll("^\"|\"$", "");
                valuePart = valuePart.replaceAll("[^\\d]", "");
                System.out.println(valuePart);
            }
            return valuePart;
        } catch (Exception e) {
            System.out.println("Got an exception! ");
            System.out.println(e.getMessage());
        }
        return null;
    }
}
