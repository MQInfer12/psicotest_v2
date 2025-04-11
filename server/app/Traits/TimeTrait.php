<?php

namespace App\Traits;

trait TimeTrait
{
  protected function get_now_local()
  {
    return now()->setTimezone('America/La_Paz');
  }

  protected function check_overlaping_hour($startTime1, $endTime1, $startTime2, $endTime2)
  {
    $startTimeObj1 = strtotime($startTime1);
    $endTimeObj1 = strtotime($endTime1);
    $startTimeObj2 = strtotime($startTime2);
    $endTimeObj2 = strtotime($endTime2);

    $inicioOverlaping = $startTimeObj1 >= $startTimeObj2 && $startTimeObj1 < $endTimeObj2;
    $finalOverlaping = $endTimeObj1 > $startTimeObj2 && $endTimeObj1 <= $endTimeObj2;
    $insideOverlaping = $inicioOverlaping || $finalOverlaping;
    $outsideOverLaping = $startTimeObj1 < $startTimeObj2 && $endTimeObj1 > $endTimeObj2;

    return $insideOverlaping || $outsideOverLaping;
  }
}
