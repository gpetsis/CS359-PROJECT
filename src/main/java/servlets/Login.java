/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package servlets;

import database.EditPetKeepersTable;
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
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        HttpSession session=request.getSession();
        if(session.getAttribute("loggedIn")!=null){
            response.setStatus(200);
//           Person p=Resources.registeredUsers.get(session.getAttribute("loggedIn").toString());
//           response.getWriter().write(p.getUsername());
        }
        else{
            response.setStatus(403);
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
        HttpSession session = request.getSession();
//        PrintStream fileOut = new PrintStream(new File("C:/CSD/PENDING/HY-359/Assignment3/Ask2/src/main/java/database/logfile.txt"));
//        System.setOut(fileOut);

        String requestString = "";

        BufferedReader in = new BufferedReader(new InputStreamReader(request.getInputStream()));
        String line = in.readLine();
        while (line != null) {
            requestString += line;
            line = in.readLine();
        }

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
