import { BaseController } from "../../shared/controllers/base.controller";
import { MenuItemsService } from "./menu-items.service";

import type { MenuItem } from "./menu-items.types";

import type { CreateMenuItemInput, UpdateMenuItemInput } from "./menu-items.schema";

export class MenuItemsController extends BaseController<
    MenuItem,
    CreateMenuItemInput,
    UpdateMenuItemInput
> {
    constructor(service: MenuItemsService) {
        super(service);
    }
}
