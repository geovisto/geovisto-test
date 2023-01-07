import {
    Geovisto,
    IMap,
    IMapProps
} from 'geovisto';
import 'geovisto/dist/index.css';

import { GeovistoSelectionTool } from 'geovisto-selection';
import { GeovistoSpikeLayerTool } from 'geovisto-layer-spike';
import { GeovistoThemesTool } from 'geovisto-themes';
import { GeovistoFiltersTool } from 'geovisto-filters';
import { GeovistoSidebarTool } from 'geovisto-sidebar';
import 'geovisto-sidebar/dist/index.css';
import { GeovistoTilesLayerTool } from 'geovisto-layer-tiles';
import { GeovistoChoroplethLayerTool } from 'geovisto-layer-choropleth';
import 'geovisto-layer-choropleth/dist/index.css';
import { GeovistoMarkerLayerTool } from 'geovisto-layer-marker';
import 'geovisto-layer-marker/dist/index.css';
import { GeovistoConnectionLayerTool } from 'geovisto-layer-connection';
import 'geovisto-layer-connection/dist/index.css';

import "./demo.scss";

const C_ID_select_data = "leaflet-combined-map-select-data";
const C_ID_check_data = "leaflet-combined-map-check-data";
const C_ID_input_data = "leaflet-combined-map-input-data";
const C_ID_check_config = "leaflet-combined-map-check-config";
const C_ID_input_config = "leaflet-combined-map-input-config";
const C_ID_input_import = "leaflet-combined-map-input-import";
const C_ID_input_export = "leaflet-combined-map-input-export";

/**
 * Demo application which demostrates the functions of Geovisto.
 * 
 * @author Jiri Hynek
 */
export class Demo {
    
    private map!: IMap;

    private polygons: Record<string, unknown>;
    private centroids: Record<string, unknown>;
    private polygons2: Record<string, unknown>;
    private centroids2: Record<string, unknown>;
    private data!: Record<string, unknown>;
    private config!: Record<string, unknown>;

    public constructor() {
        // initialize geo objects
        this.polygons = require("/static/geo/country_polygons.json");
        this.centroids = require("/static/geo/country_centroids.json");
        this.polygons2 = require("/static/geo/czech_districts_polygons.json");
        this.centroids2 = require("/static/geo/czech_districts_centroids.json");
    }

    /**
     * It renders the demo.
     */
    public render(): void {
        this.data = require('/static/data/test-dot2.json');
        this.config = require('/static/config/config.json');
        
        this.createMap(this.config, this.data);
        this.prepareToolbar();
    }

    /**
     * It updates the map.
     */
    public update(config: Record<string, unknown>, data: Record<string, unknown>): void {
        // udapte data of the map
        if(this.map) {
            this.map.redraw(Geovisto.getMapConfigManagerFactory().default(config), this.getProps(data));
        }
    }
    
    /**
     * Help method which initializes the toolbar.
     */
    protected createMap(config: Record<string, unknown>, data: Record<string, unknown>): void {
        // create and render the map
        this.map = Geovisto.createMap(this.getProps(data));
        this.map.draw(Geovisto.getMapConfigManagerFactory().default(config));
    }

    /**
     * It returns map props.
     * 
     * @param data 
     */
    protected getProps(data: Record<string, unknown>): IMapProps {
        return {
            id: "my-geovisto-map",
            data: Geovisto.getMapDataManagerFactory().json(data),
            geoData: Geovisto.getGeoDataManager([
                Geovisto.getGeoDataFactory().geojson("world polygons", this.polygons),
                Geovisto.getGeoDataFactory().geojson("world centroids", this.centroids),
                Geovisto.getGeoDataFactory().geojson("czech polygons", this.polygons2),
                Geovisto.getGeoDataFactory().geojson("czech centroids", this.centroids2)
            ]),
            globals: undefined,
            templates: undefined,
            tools: Geovisto.createMapToolsManager([
                GeovistoSidebarTool.createTool({
                    id: "geovisto-tool-sidebar",
                }),
                GeovistoFiltersTool.createTool({
                    id: "geovisto-tool-filters",
                    manager: GeovistoFiltersTool.createFiltersManager([
                        // filter operations
                        GeovistoFiltersTool.createFilterOperationEq(),
                        GeovistoFiltersTool.createFilterOperationNeq(),
                        GeovistoFiltersTool.createFilterOperationReg()
                    ])
                }),
                GeovistoThemesTool.createTool({
                    id: "geovisto-tool-themes",
                    manager: GeovistoThemesTool.createThemesManager([
                        // style themes
                        GeovistoThemesTool.createThemeLight1(),
                        GeovistoThemesTool.createThemeLight2(),
                        GeovistoThemesTool.createThemeLight3(),
                        GeovistoThemesTool.createThemeDark1(),
                        GeovistoThemesTool.createThemeDark2(),
                        GeovistoThemesTool.createThemeDark3(),
                        GeovistoThemesTool.createThemeBasic()
                    ])
                }),
                GeovistoSelectionTool.createTool({
                    id: "geovisto-tool-selection"
                }),
                GeovistoTilesLayerTool.createTool({
                    id: "geovisto-tool-layer-map"
                }),
                GeovistoChoroplethLayerTool.createTool({
                    id: "geovisto-tool-layer-choropleth"
                }),
                GeovistoMarkerLayerTool.createTool({
                    id: "geovisto-tool-layer-marker"
                }),
                GeovistoConnectionLayerTool.createTool({
                    id: "geovisto-tool-layer-connection"
                }),
                GeovistoSpikeLayerTool.createTool({
                    id: "geovisto-tool-layer-spike"
                }),
            ])
        };
    }
    
    /**
     * Help method which initializes the toolbar.
     */
    protected prepareToolbar(): void {

        // ------ enable check boxes ------ //
    
        const enableInput = function(checked: boolean, id: string) {
            if(checked) {
                document.getElementById(id)?.removeAttribute("disabled");
            } else {
                document.getElementById(id)?.setAttribute("disabled", "disabled");
            }
        };
    
        // enable data check box
        const enableDataInput = function(e: Event) {
            enableInput((e.target as HTMLInputElement).checked, C_ID_input_data);
        };
        const inputData = document.getElementById(C_ID_input_data);
        if(inputData) {
            inputData.setAttribute("disabled", "disabled");
        }
        const checkData = document.getElementById(C_ID_check_data);
        if(checkData) {
            checkData.onchange = enableDataInput;
        }
    
        // enable config check box
        const enableConfigInput = function(e: Event) {
            enableInput((e.target as HTMLInputElement).checked, C_ID_input_config);
        };
        const inputConfig = document.getElementById(C_ID_input_config);
        if(inputConfig) {
            inputConfig.setAttribute("disabled", "disabled");
        }
        const checkConfig = document.getElementById(C_ID_check_config);
        if(checkConfig) {
            checkConfig.onchange = enableConfigInput;
        }
    
        // ------ process files ------ //
    
        // process path
        const pathSubmitted = function(file: File, result: { json: unknown | undefined }) {
            const reader = new FileReader();
            const onLoadAction = function(e: ProgressEvent<FileReader>) {
                try {
                    console.log(e);
                    //console.log(reader.result);
                    if(typeof reader.result == "string") {
                        result.json = JSON.parse(reader.result);
                    }
                } catch(ex) {
                    console.log("unable to read file");
                    console.log(ex);
                    // TODO: notify user
                }
            };
            reader.onload = onLoadAction;
            reader.readAsText(file);
        };
    
        // process data path
        const data : { json: Record<string, unknown> | undefined} = {
            json: undefined
        };
        const dataPathSubmitted = function(this: HTMLInputElement) {
            console.log(this.files);
            if(this.files) {
                pathSubmitted(this.files[0], data);
            }
        };
        if(inputData) {
            inputData.addEventListener('change', dataPathSubmitted, false);
        }
    
        // process config path
        const config : { json: Record<string, unknown> | undefined} = {
            json: undefined
        };
        const configPathSubmitted = function(this: HTMLInputElement) {
            console.log(this.files);
            if(this.files) {
                pathSubmitted(this.files[0], config);
            }
        };
        if(inputConfig) {
            inputConfig.addEventListener('change', configPathSubmitted, false);
        }
    
        // ------ import ------ //
    
        // import action
        const importAction = (e: MouseEvent) => {
    
            console.log(e);
            console.log("data: ", data);
            console.log("config: ", config);
    
            // process data json
            if(!(document.getElementById(C_ID_check_data) as HTMLInputElement).checked || data.json == undefined) {
                const fileName = (document.getElementById(C_ID_select_data) as HTMLInputElement).value;
                console.log(fileName);
                data.json = require('/static/data/' + fileName);
            }
    
            // process config json
            if(!(document.getElementById(C_ID_check_config) as HTMLInputElement).checked || config.json == undefined) {
                config.json = require('/static/config/config.json');
            }
    
            // update state
            if(config.json && data.json) {
                this.update(config.json, data.json);
            }
        };
        const btnImport =  document.getElementById(C_ID_input_import);
        if(btnImport) {
            btnImport.addEventListener('click', importAction);
        }
    
        // ------ export ------ //
    
        // export action
        const exportAction = (e: MouseEvent) => {
            console.log(e);
    
            // expert map configuration
            const config = JSON.stringify(this.map.export(), null, 2);
    
            // download file
            const element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(config));
            element.setAttribute('download', "config.json");
            element.style.display = 'none';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
    
            console.log("rendered map:", );
        };
        const btnExport =  document.getElementById(C_ID_input_export);
        if(btnExport) {
            btnExport.addEventListener('click', exportAction);
        }
    }
}