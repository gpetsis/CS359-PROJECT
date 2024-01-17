/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package servlets;

import database.EditPetKeepersTable;
import database.EditPetOwnersTable;
import database.EditPetsTable;
import java.io.BufferedReader;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.logging.Level;
import java.util.logging.Logger;
import mainClasses.PetKeeper;
import mainClasses.PetOwner;

public class Login extends HttpServlet {

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");
        
    }

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
//        PrintStream fileOut = new PrintStream(new File("C:\\CSD\\PENDING\\HY-359\\PROJECT\\CS359-PROJECT\\src\\main\\webapp\\logfile.txt"));
//        System.setOut(fileOut);
        String header = request.getHeader("Request-Type");
        if (header.equals("Number-Of-Cats")) {
            handleNumberOfCats(request, response);
        } else if (header.equals("Number-Of-Dogs")) {
            handleNumberOfDogs(request, response);
        } else if (header.equals("Number-Of-Owners")) {
            handleNumberOfOwners(request, response);
        } else if (header.equals("Number-Of-Keepers")) {
            handleNumberOfKeepers(request, response);
        } else if (header.equals("Total-Earnings")) {
            handleTotalEarnings(request, response);
        } else {
            HttpSession session = request.getSession();
            if (session.getAttribute("loggedIn") != null) {
                response.setStatus(200);
            } else {
                response.setStatus(403);
            }
        }
    }

    public void handleTotalEarnings(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
//        EditBookingsTable ebt = new EditBookingsTable();
//        int numberOfCats = ebt.numberOfCats();
//        response.getWriter().write(String.valueOf(numberOfCats));
//        System.out.println(numberOfCats);
    }

    public void handleNumberOfOwners(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
//        EditPetsTable ept = new EditPetsTable();
//        int numberOfCats = ept.numberOfCats();
//        response.getWriter().write(String.valueOf(numberOfCats));
//        System.out.println(numberOfCats);
    }

    public void handleNumberOfKeepers(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
//        EditPetsTable ept = new EditPetsTable();
//        int numberOfCats = ept.numberOfCats();
//        response.getWriter().write(String.valueOf(numberOfCats));
//        System.out.println(numberOfCats);
    }

    public void handleNumberOfCats(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        EditPetsTable ept = new EditPetsTable();
        int numberOfCats = ept.numberOfCats();
        response.getWriter().write(String.valueOf(numberOfCats));
        System.out.println(numberOfCats);
    }

    public void handleNumberOfDogs(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        EditPetsTable ept = new EditPetsTable();
        int numberOfDogs = ept.numberOfDogs();
        response.getWriter().write(String.valueOf(numberOfDogs));
        System.out.println(numberOfDogs);
    }


    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String getUserType = request.getHeader("User");
        System.out.println(getUserType);
        HttpSession session = request.getSession();
        String requestString = "";

        BufferedReader in = new BufferedReader(new InputStreamReader(request.getInputStream()));
        String line = in.readLine();
        while (line != null) {
            requestString += line;
            line = in.readLine();
        }

        if (getUserType.equals("PetOwner")) {
            EditPetOwnersTable epo = new EditPetOwnersTable();
            PetOwner owner = epo.jsonToPetOwner(requestString);
            System.out.println(owner.getUsername() + owner.getPassword());

            try {
                owner = epo.databaseToPetOwners(owner.getUsername(), owner.getPassword());
                System.out.println(owner.getUsername() + owner.getPassword());
                if (owner != null) {
                    session.setAttribute("loggedIn", owner.getUsername());
                    response.setStatus(200);
                } else {
                    response.setStatus(403);
                }

            } catch (Exception ex) {
                Logger.getLogger(Login.class.getName()).log(Level.SEVERE, null, ex);
                response.setStatus(403);
            }

        } else {
            EditPetKeepersTable epk = new EditPetKeepersTable();
            PetKeeper keeper = epk.jsonToPetKeeper(requestString);
            System.out.println(keeper.getUsername() + keeper.getPassword());

            try {
                keeper = epk.databaseToPetKeepers(keeper.getUsername(), keeper.getPassword());
                System.out.println(keeper.getUsername() + keeper.getPassword());
                if (keeper != null) {
                    session.setAttribute("loggedIn", keeper.getUsername());
                    response.setStatus(200);
                } else {
                    response.setStatus(403);
                }

            } catch (Exception ex) {
                Logger.getLogger(Login.class.getName()).log(Level.SEVERE, null, ex);
                response.setStatus(403);
            }
        }
    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

}
