import React, { useContext, useState, useEffect } from "react";
import { DataGrid } from "@material-ui/data-grid";
import {
  putMetrics,
} from "../../../api/metrics/metrics";

import { ManageMetrics } from "../../../helpers/metrics/metrics"

import AppContext from "../../../auth/context/context";
import Loader from "../../Loader/Loader";
import nodeHelper from "../../../helpers/nodes/nodes";
import "./inputs.css";
import { Alert, AlertTitle } from "@material-ui/lab";

/**
 * Componente que representa
 * la tabla de aristas del proyecto selecionado
 */
const EdgesTable = () => {
  const { user, selectedProject, setReloadSidebar } = useContext(AppContext);
  const [loader, setLoader] = useState(true);

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "source", headerName: "Origen", width: 300 },
    { field: "target", headerName: "Destino", width: 300 },
    { field: "relation", headerName: "Relación", width: 200 },
  ];

  const columns1 = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "source", headerName: "Origen", width: 300 },
    { field: "target", headerName: "Destino", width: 300 },
    { field: "relation", headerName: "Relación", width: 200 },
    { field: "coupling", headerName: "Coupling", width: 200 },
    { field: "abstractness", headerName: "Abstracción", width: 200 },
    { field: "instability", headerName: "Inestabilidad", width: 200 },
    { field: "dms", headerName: "DMS", width: 200 },
    { field: "nameRessemblance", headerName: "Semejanza de Nombre", width: 200 },
    { field: "packageMapping", headerName: "Mapeo de Paquetes", width: 200 },

  ];

  // Getting the values of each input fields
  const [dms, setDms] = useState(10);
  const [nameResemblance, setNameResemblance] = useState(40);
  const [packageMapping, setPackageMapping] = useState(40);
  const [umbralName, setUmbralName] = useState(0.65);
  const [umbral, setUmbral] = useState(0.65);
  const [sum, setSum] = useState(
    dms + nameResemblance + packageMapping
  );

  // Calculate the sum total of all the input fields
  function calculateTotal() {
    setSum(dms + nameResemblance + packageMapping);
  }

  // Getting all the nodes and mapping through each item
  let nodesDos = selectedProject.elements.nodes.map((node) => {
    return {
      id: node.data.id,
      name: node.data.name,
      module: node.data.module,
      incompleteResources: node.data.incompleteResources,
    };
  });

  // Getting all the edges (relaciones)
  let edgesDos = nodeHelper.getRelationData(selectedProject);

  // For loop to get the Q and answer

  if (sum <= 100) {
    for (let i = 0; i < edgesDos.length; i++) {
      let flag1 = false;
      let flag2 = false;
      let dividen1 = 0;
      let dividen2 = 0;
      for (let j = 0; j < nodesDos.length; j++) {
        if (
          nodesDos[j].id === edgesDos[i].source &&
          nodesDos[j].incompleteResources
        ) {
          flag1 = true;
          edgesDos[i].q = 0;
          edgesDos[i].answer = "No Aplica";
        }
        if (
          nodesDos[j].id === edgesDos[i].target &&
          nodesDos[j].incompleteResources
        ) {
          flag2 = true;
          edgesDos[i].q = 0;
          edgesDos[i].answer = "No Aplica";
        }
        if (flag1 || flag2) {
          break;
        }
      }
      if (!flag1 && !flag2) {

        if (edgesDos[i].coupling >= 0.6) {
          dividen1 =
            edgesDos[i].nameResemblance * nameResemblance;
        }
        dividen1 = dividen1 + edgesDos[i].packageMapping * packageMapping;
        dividen2 = edgesDos[i].dms * dms;

        let q = (dividen1 - dividen2) / sum;
        edgesDos[i].q = q.toFixed(2);

        if (q >= umbral) {
          edgesDos[i].answer = "SI";
        } else {
          edgesDos[i].answer = "NO";
        }
      }

    }
  }

  useEffect(() => {
    console.log("useEffect")
    setLoader(false);
  }, [selectedProject.elements]);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);






  return (
    <div style={{ height: "80vh", width: "100%" }}>
      <form className="form-styles">
        <div className="input">
          <div className="input-align">
            <input
              value={dms}
              onChange={(e) => setDms(+e.target.value)}
              className="input-styles"
              placeholder="W DMS"
              name="dms"
            />
            <label className="input-label">Peso DMS</label>
          </div>
          <div className="input-align">
            <input
              className="input-styles"
              placeholder="W Sem. de Nombre"
              name="semejanza"
              value={nameResemblance}
              onChange={(e) => setNameResemblance(+e.target.value)}
            />
            <label className="input-label">Peso Semejanza de Nombre</label>
          </div>
          <div className="input-align">
            <input
              className="input-styles"
              placeholder="W Mapeo de Paquete"
              name="paquete"
              value={packageMapping}
              onChange={(e) => setPackageMapping(+e.target.value)}
            />
            <label className="input-label">Peso Mapeo de Paquete</label>
          </div>
          <div className="input-align-umbral">
            <input
              className="input-styles-umbral"
              placeholder="Umbral Semejanza"
              name="umbral"
              value={umbralName}
              type="number"
              min="0"
              max="1"
              onChange={(e) => setUmbralName(e.target.value)}
            />
            <label className="input-label">Umbral Semejanza</label>
          </div>
          <div className="input-align-umbral">
            <input
              className="input-styles-umbral"
              placeholder="Umbral"
              name="umbral"
              value={umbral}
              type="number"
              min="0"
              max="1"
              onChange={(e) => setUmbral(e.target.value)}
            />
            <label className="input-label">Umbral Q</label>
          </div>
        </div>
        <div className="btn-total">
          <button onClick={() => ManageMetrics(user, selectedProject, setReloadSidebar, umbralName)
          }>
            Calcular Metricas
          </button>
        </div>
      </form>
      <div className="total-sum">
        <p>
          Total:<span>{sum}</span>
        </p>
      </div>
      {sum > 100 ?
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          El total de los pesos no puede ser mayor a 100 — <strong>Vuelve a calcular!</strong>
        </Alert>
        :
        <Alert severity="success">
          <AlertTitle>Calculo Exitoso</AlertTitle>
        </Alert>
      }
      {!loader ? (
        <DataGrid rows={edgesDos} columns={columns1} pageSize={10} />
      ) : (
        <Loader />
      )}
    </div>
  );}












//   return (
//     <div style={{ height: 800, width: "100%" }}>
//       <button onClick={() => ManageMetrics(user, selectedProject, setReloadSidebar)
//       }>
//         Calcular Metricas
//       </button>
//       {!loader ? (
//         <DataGrid rows={edgesDos} columns={columns1} pageSize={10} />
//       ) : (
//         <Loader />
//       )}
//     </div>
//   );
// };

export default EdgesTable;
