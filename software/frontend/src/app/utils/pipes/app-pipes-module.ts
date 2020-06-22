import { NgModule } from '@angular/core';
import { DataStrPipe } from './data-str.pipe';
import { IdadePipe } from './idade.pipe';
import { NullDataPipe } from './null-data.pipe';

// other imports

@NgModule({
  imports: [
    // dep modules
  ],
  declarations: [
    DataStrPipe,
    IdadePipe,
    NullDataPipe
  ],
  exports: [
    DataStrPipe,
    IdadePipe,
    NullDataPipe
  ]
})
export class AppPipesModule {}
