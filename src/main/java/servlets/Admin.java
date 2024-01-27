package servlets;

import database.EditPetKeepersTable;
import database.EditPetOwnersTable;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import mainClasses.PetKeeper;
import mainClasses.PetOwner;

public class Admin extends HttpServlet {

    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");
        try (PrintWriter out = response.getWriter()) {
            out.println("<!DOCTYPE html>");
            out.println("<html>");
            out.println("<head>");
            out.println("<title>Servlet Admin</title>");
            out.println("</head>");
            out.println("<body>");
            out.println("<h1>Servlet Admin at " + request.getContextPath() + "</h1>");
            out.println("</body>");
            out.println("</html>");
        }
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        try {
            String type = request.getHeader("Type");
            EditPetOwnersTable epo = new EditPetOwnersTable();
            EditPetKeepersTable epk = new EditPetKeepersTable();
            ArrayList<PetOwner> owners = epo.getOwners();
            ArrayList<PetKeeper> keepers = epk.getKeepers("catkeeper");
            ArrayList<String> users = new ArrayList<String>();
            keepers.addAll(epk.getKeepers("dogkeeper"));
            if (!type.equals("GuestPage")) {
                for (int i = 0; i < owners.size(); i++) {
                    PetOwner owner = owners.get(i);
                    String ownerJSON = epo.petOwnerToJSON(owner);
                    users.add(ownerJSON);
                }
            }
            for (int i = 0; i < keepers.size(); i++) {
                PetKeeper keeper = keepers.get(i);
                String keeperJSON = epk.petKeeperToJSON(keeper);
                users.add(keeperJSON);
            }
            if (type.equals("GuestPage")) {
                List<String> onlyKeepers = removeDuplicates(users);
                response.getWriter().write(onlyKeepers.toString());
            } else {
                response.getWriter().write(users.toString());
            }
            System.out.println(users.toString());
        } catch (SQLException | ClassNotFoundException ex) {
            Logger.getLogger(Admin.class.getName()).log(Level.SEVERE, null, ex);
            System.out.println("error: " + ex);
        }

    }

    public static List<String> removeDuplicates(List<String> list) {
        Set<String> set = new HashSet<>(list);
        return new ArrayList<>(set);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    }

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String requestString = "";

        BufferedReader in = new BufferedReader(new InputStreamReader(request.getInputStream()));
        String line = in.readLine();
        while (line != null) {
            requestString += line;
            line = in.readLine();
        }

        if (requestString.contains("owner_id")) {

            try {
                EditPetOwnersTable epo = new EditPetOwnersTable();
                PetOwner owner = epo.jsonToPetOwner(requestString);
                epo.deletePetOwner(owner.getOwnerId());
            } catch (SQLException | ClassNotFoundException ex) {
                System.out.println("Error: " + ex);
                Logger.getLogger(Admin.class.getName()).log(Level.SEVERE, null, ex);
            }

            System.out.println("Owner");
        } else {

            try {
                EditPetKeepersTable epk = new EditPetKeepersTable();
                PetKeeper keeper = epk.jsonToPetKeeper(requestString);
                epk.deletePetKeeper(keeper.getKeeperId());
            } catch (SQLException | ClassNotFoundException ex) {
                System.out.println("Error: " + ex);
                Logger.getLogger(Admin.class.getName()).log(Level.SEVERE, null, ex);
            }

            System.out.println("Keeper");
        }

        System.out.println(requestString);

    }

    @Override
    public String getServletInfo() {
        return "Short description";
    }

}
