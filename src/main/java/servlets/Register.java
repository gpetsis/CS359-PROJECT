/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package servlets;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.logging.Level;
import java.util.logging.Logger;
import database.EditPetOwnersTable;
import database.EditPetKeepersTable;
import java.sql.SQLException;
import java.util.ArrayList;
import javax.servlet.http.HttpSession;
import mainClasses.PetKeeper;
import mainClasses.PetOwner;

/**
 *
 * @author mountant
 */
public class Register extends HttpServlet {

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
        String getType = request.getHeader("User");
        System.out.println(getType);
        HttpSession session = request.getSession();
        if (getType.equals("PetOwner")) {
            EditPetOwnersTable epo = new EditPetOwnersTable();
            try {
                PetOwner petowner = epo.databaseToPetOwners(session.getAttribute("loggedIn").toString());
                if (petowner != null) {
                    response.getWriter().write(epo.petOwnerToJSON(petowner));
                    response.setStatus(200);
                } else {
                    response.setStatus(404);
                }
            } catch (SQLException | ClassNotFoundException ex) {
                Logger.getLogger(Register.class.getName()).log(Level.SEVERE, null, ex);
            }
        } else {
            EditPetKeepersTable epk = new EditPetKeepersTable();
            try {
                PetKeeper petkeeper = epk.databaseToPetKeepers(session.getAttribute("loggedIn").toString());

                if (petkeeper != null) {
                    response.getWriter().write(epk.petKeeperToJSON(petkeeper));
                    response.setStatus(200);
                } else {
                    response.setStatus(404);
                }
            } catch (Exception ex) {
                response.setStatus(404);
                Logger.getLogger(Register.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }

    /**
     * Handles the HTTP <code>PUT</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
//        PrintStream fileOut = new PrintStream(new File("C:\\Users\\Nikos Lasithiotakis\\Desktop\\CSD\\5ο Εξάμηνο\\ΗΥ359\\CS359-PROJECT\\src\\main\\java\\database\\logfile.txt"));
//        System.setOut(fileOut);
        String getUserType = request.getHeader("User");
        System.out.println(getUserType);
        HttpSession session = request.getSession();

        EditPetKeepersTable epk = new EditPetKeepersTable();

        SQLException returnEx;

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
            try {
                returnEx = epo.updatePetOwner(owner);
                response.setStatus(200);
            } catch (Exception ex) {
                response.setStatus(406);
                response.getWriter().println("Error updating");
                Logger.getLogger(Register.class.getName()).log(Level.SEVERE, null, ex);
            }
        } else {
            PetKeeper keeper = epk.jsonToPetKeeper(requestString);
            try {
                response.getWriter().println("Started updating");
                returnEx = epk.updatePetKeeper(keeper);
                response.getWriter().println("Completed");
                response.setStatus(200);
            } catch (Exception ex) {
                response.setStatus(406);
                response.getWriter().println("Error updating");
                Logger.getLogger(Register.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
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
        EditPetOwnersTable epo = new EditPetOwnersTable();
        EditPetKeepersTable epk = new EditPetKeepersTable();

        SQLException returnEx;

        String requestString = "";

        BufferedReader in = new BufferedReader(new InputStreamReader(request.getInputStream()));
        String line = in.readLine();
        while (line != null) {
            requestString += line;
            line = in.readLine();
        }

        try {
            if (requestString.contains("pet-owner")) {
                ArrayList<PetKeeper> petkeepers = epk.getKeepers("both");
                PetKeeper keeper = epk.jsonToPetKeeper(requestString);
                String keeperUsername = keeper.getUsername();

                for (PetKeeper petkeeper : petkeepers) {
                    if ((petkeeper.getUsername()).equals(keeperUsername) || (petkeeper.getEmail()).equals(keeper.getEmail())) {
                        response.setStatus(409);
                        return;
                    }
                }
                returnEx = epo.addPetOwnerFromJSON(requestString);
            } else {
                ArrayList<PetOwner> petowners = epo.getOwners();
                PetOwner owner = epo.jsonToPetOwner(requestString);
                String ownerUsername = owner.getUsername();

                for (PetOwner petowner : petowners) {
                    if ((petowner.getUsername()).equals(ownerUsername) || (petowner.getEmail()).equals(owner.getEmail())) {
                        response.setStatus(409);
                        return;
                    }
                }
                returnEx = epk.addPetKeeperFromJSON(requestString);
            }
            if (returnEx instanceof java.sql.SQLIntegrityConstraintViolationException) {
                response.setStatus(409);
            } else if (returnEx == null) {
                response.setStatus(200);
            }
        } catch (ClassNotFoundException ex) {
            Logger.getLogger(Register.class.getName()).log(Level.SEVERE, null, ex);
            response.setStatus(500);
            return;
        } catch (SQLException ex) {
            Logger.getLogger(Register.class.getName()).log(Level.SEVERE, null, ex);
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
